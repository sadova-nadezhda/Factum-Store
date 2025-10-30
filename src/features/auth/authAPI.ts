import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';
import { setToken } from './authSlice';

import type {
  AuthResponse, LoginDto, User, UpdateMeDto,
  RegisterDto, RegisterResponse, ForgotDto, ForgotResponse, ResetDto, ResetResponse
} from '@/types/UserTypes';

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body, validateStatus: okIfNoError }),
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if ((data as any)?.token) dispatch(setToken((data as any).token));
          dispatch(rootApi.util.invalidateTags(['Me', 'Wallets']));
        } catch {}
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body, validateStatus: okIfNoError }),
    }),
    forgot: builder.mutation<ForgotResponse, ForgotDto>({
      query: (body) => ({ url: '/auth/forgot', method: 'POST', body, validateStatus: okIfNoError }),
    }),
    reset: builder.mutation<ResetResponse, ResetDto>({
      query: (body) => ({ url: '/auth/reset', method: 'POST', body, validateStatus: okIfNoError }),
    }),
    getMe: builder.query<User, void>({
      query: () => ({ url: '/me', method: 'GET', validateStatus: okIfNoError }),
      providesTags: ['Me'],
      keepUnusedDataFor: 60,
    }),
    updateMe: builder.mutation<{ status: 'ok' | 'noop' }, UpdateMeDto>({
      query: (body) => ({ url: '/me', method: 'PATCH', body, validateStatus: okIfNoError }),
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
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotMutation,
  useResetMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
} = authApi;