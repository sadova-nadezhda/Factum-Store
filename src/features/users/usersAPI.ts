import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';
import type { AdminUser, GetUsersParams, OkResponse } from '@/types/AdminUserTypes';

import type { UserLite } from '@/types/UserLite';

export const usersApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({

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
          validateStatus: okIfNoError,
        };
      },
      keepUnusedDataFor: 30,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useActivateUserMutation,
  useGetUsersForTransfersQuery,
} = usersApi;