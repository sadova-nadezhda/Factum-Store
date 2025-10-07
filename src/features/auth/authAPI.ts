import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  AuthResponse, LoginDto, User, UpdateMeDto,
  RegisterDto, RegisterResponse, ForgotDto, ForgotResponse, ResetDto, ResetResponse
} from '../../types/UserTypes';
import type { UserLite } from '../../types/UserLite';
import type {
  AdminUser, GetUsersParams, UpdateUserDto, OkResponse
} from '../../types/AdminUserTypes';
import type { CreateTransferDto, CreateTransferResponse, WalletsMyResponse } from '../../types/WalletTypes';
import type { RootState } from '../../app/store';


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV ? '/api' : 'https://merch.factum.work/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token ?? localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Me', 'Wallets', 'Users'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({ 
        url: '/auth/login', 
        method: 'POST', 
        body, 
        validateStatus: (response, result) =>
          response.status >= 200 &&
          response.status < 300 &&
          !(result as any)?.error, 
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (body) => ({ 
        url: '/auth/register', 
        method: 'POST', 
        body,
        validateStatus: (response, result) =>
          response.status >= 200 &&
          response.status < 300 &&
          !(result as any)?.error,  
      }),
    }),
    forgot: builder.mutation<ForgotResponse, ForgotDto>({
      query: (body) => ({ url: '/auth/forgot', method: 'POST', body }),
    }),
    reset: builder.mutation<ResetResponse, ResetDto>({
      query: (body) => ({ url: '/auth/reset', method: 'POST', body }),
    }),

    getMe: builder.query<User, void>({
      query: () => ({ url: '/me', method: 'GET' }),
      providesTags: ['Me'],
    }),
    updateMe: builder.mutation<{ status: 'ok' | 'noop' }, UpdateMeDto>({
      query: (body) => ({ url: '/me', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    uploadAvatar: builder.mutation<{ status: 'ok'; avatar: string }, { file: File }>({
      query: ({ file }) => {
        const form = new FormData();
        form.append('avatar', file);
        return { url: '/me/avatar', method: 'POST', body: form };
      },
      invalidatesTags: ['Me'],
    }),

    getMyWallets: builder.query<WalletsMyResponse, void>({
      query: () => ({ url: '/wallets/my', method: 'GET' }),
      providesTags: ['Wallets'],
    }),

    createOrder: builder.mutation<{ status: 'ok' }, { product_id: number | string; qty: number }>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
        responseHandler: 'text',
      }),
      transformResponse: (raw: string) => {
        if (!raw) return { status: 'ok' as const };
        try { return JSON.parse(raw); } catch { return { status: 'ok' as const }; }
      },
      invalidatesTags: ['Wallets', 'Me'],
    }),

    createTransfer: builder.mutation<CreateTransferResponse | { status: 'ok' }, CreateTransferDto>({
      query: (body) => ({
        url: '/transfers',
        method: 'POST',
        body,
        responseHandler: 'text',
        validateStatus: (resp) => resp.status >= 200 && resp.status < 300,
      }),
      transformResponse: (_raw: string) => ({ status: 'ok' as const }),
      invalidatesTags: ['Wallets'],
    }),

    getUsers: builder.query<AdminUser[], GetUsersParams | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.q)        search.set('q', params.q);
        if (params?.page)     search.set('page', String(params.page));
        if (params?.per_page) search.set('per_page', String(params.per_page));
        const qs = search.toString();
        return { url: `/users${qs ? `?${qs}` : ''}`, method: 'GET' };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),

    updateUser: builder.mutation<OkResponse, { id: number; data: UpdateUserDto }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    activateUser: builder.mutation<OkResponse, { id: number }>({
      query: ({ id }) => ({ url: `/users/${id}/activate`, method: 'POST' }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    getUsersForTransfers: builder.query<UserLite[], { q?: string } | void>({
      query: (arg) => {
        const q = arg?.q?.trim() ?? '';
        return {
          url: '/users/for-transfers',
          method: 'GET',
          params: q ? { q } : undefined,
        };
      },
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
} = authApi;
