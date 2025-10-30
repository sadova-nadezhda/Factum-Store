import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/baseQuery';
import { setToken } from './authSlice';
import { okIfNoError } from '@/shared/rtkValidate';

import { catalogApi } from '../catalog/catalogAPI';

import type {
  AuthResponse, LoginDto, User, UpdateMeDto,
  RegisterDto, RegisterResponse, ForgotDto, ForgotResponse, ResetDto, ResetResponse
} from '@/types/UserTypes';
import type { UserLite } from '@/types/UserLite';
import type { AdminUser, GetUsersParams, UpdateUserDto, OkResponse } from '@/types/AdminUserTypes';
import type { CreateTransferDto, CreateTransferResponse, WalletsMyResponse } from '@/types/WalletTypes';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Me', 'Wallets', 'Users'],

  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: (builder) => ({

    // ---------- auth ----------
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
        validateStatus: okIfNoError,
      }),
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if ((data as any)?.token) {
            dispatch(setToken((data as any).token));
          }
          dispatch(authApi.util.invalidateTags(['Me', 'Wallets']));
        } catch {}
      },
    }),

    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (body) => ({ 
        url: '/auth/register', 
        method: 'POST', 
        body,
        validateStatus: okIfNoError,
      }),
    }),

    forgot: builder.mutation<ForgotResponse, ForgotDto>({
      query: (body) => ({ 
        url: '/auth/forgot', 
        method: 'POST', 
        body,
        validateStatus: okIfNoError,
      }),
    }),

    reset: builder.mutation<ResetResponse, ResetDto>({
      query: (body) => ({ 
        url: '/auth/reset', 
        method: 'POST', 
        body,
        validateStatus: okIfNoError,
       }),
    }),

    // ---------- profile ----------
    getMe: builder.query<User, void>({
      query: () => ({ url: '/me', method: 'GET', validateStatus: okIfNoError }),
      providesTags: ['Me'],
      keepUnusedDataFor: 60,
    }),

    updateMe: builder.mutation<{ status: 'ok' | 'noop' }, UpdateMeDto>({
      query: (body) => ({ 
        url: '/me', 
        method: 'PATCH', 
        body,
        validateStatus: okIfNoError, 
      }),
      invalidatesTags: ['Me'],
    }),

    uploadAvatar: builder.mutation<{ status: 'ok'; avatar: string }, { file: File }>({
      query: ({ file }) => {
        const form = new FormData();
        form.append('avatar', file);
        return { url: '/me/avatar', method: 'POST', body: form, validateStatus: okIfNoError };
      },
      invalidatesTags: ['Me'],
    }),

    // ---------- wallets/orders/transfers ----------
    getMyWallets: builder.query<WalletsMyResponse, void>({
      query: () => ({ url: '/wallets/my', method: 'GET', validateStatus: okIfNoError }),
      providesTags: ['Wallets'],
      keepUnusedDataFor: 60,
    }),

    createOrder: builder.mutation<{ status: 'ok' }, { product_id: number | string; qty: number }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        responseHandler: 'text',
        validateStatus: (resp, raw) => {
          try {
            const parsed = raw ? JSON.parse(String(raw)) : null;
            return resp.ok && !(parsed as any)?.error;
          } catch {
            return resp.ok;
          }
        }
      }),
      transformResponse: (raw: string) => {
        if (!raw) return { status: 'ok' as const };
        try { return JSON.parse(raw); } catch { return { status: 'ok' as const }; }
      },
      async onQueryStarted({ product_id, qty }, { dispatch, getState, queryFulfilled }) {
        const productId = String(product_id);
        const patches: { undo: () => void }[] = [];

        const state: any = getState();
        const queries = state?.[catalogApi.reducerPath]?.queries ?? {};
        for (const key of Object.keys(queries)) {
          if (!key.startsWith('getProducts(')) continue;
          const argsJson = key.slice(key.indexOf('(') + 1, -1);
          let args: any = undefined;
          try {
            const parsed = JSON.parse(argsJson);
            args = { q: parsed.q || undefined, sort: parsed.sort || undefined };
            if (!parsed.q && !parsed.sort) args = undefined;
          } catch {}
          const p = dispatch(
            catalogApi.util.updateQueryData('getProducts', args, (draft: any[]) => {
              const item = draft.find(x => String(x.id) === productId);
              if (item && typeof item.stock === 'number') item.stock = Math.max(0, item.stock - qty);
            })
          );
          patches.push(p);
        }

        const pOne = dispatch(
          catalogApi.util.updateQueryData('getProduct' as any, productId, (draft: any) => {
            if (draft && typeof draft.stock === 'number') draft.stock = Math.max(0, draft.stock - qty);
          })
        );
        patches.push(pOne);

        try {
          await queryFulfilled;
          dispatch(catalogApi.util.invalidateTags([
            { type: 'Products', id: 'LIST' },
            { type: 'Product', id: productId },
          ]));
        } catch {
          patches.forEach(p => p.undo());
        }
      },
      invalidatesTags: ['Wallets', 'Me'],
    }),

    cancelOrder: builder.mutation<{ status: 'ok' }, { id: number | string }>({
      query: ({ id }) => ({
        url: `/orders/${id}/user-cancel`,
        method: 'PATCH',
        responseHandler: 'text',
        validateStatus: okIfNoError,
      }),
      transformResponse: (raw: string) => {
        if (!raw) return { status: 'ok' as const };
        try { return JSON.parse(raw); } catch { return { status: 'ok' as const }; }
      },
    }),

    createTransfer: builder.mutation<CreateTransferResponse, CreateTransferDto>({
      query: (body) => ({
        url: '/transfers',
        method: 'POST',
        body,
        validateStatus: okIfNoError,
      }),
      invalidatesTags: ['Wallets'],
    }),

    // ---------- admin/users ----------
    getUsers: builder.query<AdminUser[], GetUsersParams | void>({
      query: (params) => {
        const q = params?.q?.trim();
        const page = params?.page;
        const per_page = params?.per_page;

        const has = (v: unknown) => v !== undefined && v !== null && v !== '';
        const search = new URLSearchParams();
        if (has(q)) search.set('q', String(q));
        if (has(page)) search.set('page', String(page));
        if (has(per_page)) search.set('per_page', String(per_page));

        const qs = search.toString();
        return { url: `/users${qs ? `?${qs}` : ''}`, method: 'GET', validateStatus: okIfNoError };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const a = queryArgs ?? {};
        return JSON.stringify({
          q: a.q ?? '',
          page: a.page ?? '',
          per_page: a.per_page ?? '',
        });
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),

    updateUser: builder.mutation<OkResponse, { id: number; data: UpdateUserDto }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data, validateStatus: okIfNoError }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    activateUser: builder.mutation<OkResponse, { id: number }>({
      query: ({ id }) => ({ url: `/users/${id}/activate`, method: 'POST', validateStatus: okIfNoError }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    getUsersForTransfers: builder.query<UserLite[], { q?: string } | void>({
      query: (arg) => {
        const q = arg?.q?.trim();
        return {
          url: '/users/for-transfers',
          method: 'GET',
          ...(q ? { params: { q } } : {}),
          validateStatus: okIfNoError
        };
      },
      keepUnusedDataFor: 30,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotMutation,
  useResetMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetMyWalletsQuery,
  useCreateOrderMutation,
  useCreateTransferMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useActivateUserMutation,
  useGetUsersForTransfersQuery,
  useUploadAvatarMutation,
  useCancelOrderMutation,
} = authApi;