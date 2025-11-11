import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';

import type {
  CreateTransferDto,
  CreateTransferResponse,
  DeductDto,
  DeductResponse,
  WalletsMyResponse,
} from '@/types/WalletTypes';

export const walletsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({

    getMyWallets: builder.query<WalletsMyResponse, void>({
      query: () => ({
        url: '/wallets/my',
        method: 'GET',
        validateStatus: okIfNoError,
      }),
      providesTags: ['Wallets'],
      keepUnusedDataFor: 60,
    }),

    createTransfer: builder.mutation<CreateTransferResponse, CreateTransferDto>({
      query: ({ from_type, reason, ...rest }) => {
        const body: Record<string, unknown> = { from_type, ...rest };
        if (from_type === 'manager_pool' && typeof reason === 'string' && reason.trim()) {
          body.reason = reason.trim();
        }
        return {
          url: '/transfers',
          method: 'POST',
          body,
          validateStatus: okIfNoError,
        };
      },
      invalidatesTags: ['Wallets'],
    }),

    deductCoins: builder.mutation<DeductResponse, DeductDto>({
      query: (body) => ({
        url: '/transfers/deduct',
        method: 'POST',
        body,
        validateStatus: okIfNoError,
      }),
      invalidatesTags: ['Wallets'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetMyWalletsQuery,
  useCreateTransferMutation,
  useDeductCoinsMutation,
} = walletsApi;