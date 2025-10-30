import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';

import type {
  CreateTransferDto, CreateTransferResponse, WalletsMyResponse
} from '@/types/WalletTypes';

export const walletsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWallets: builder.query<WalletsMyResponse, void>({
      query: () => ({ url: '/wallets/my', method: 'GET', validateStatus: okIfNoError }),
      providesTags: ['Wallets'],
      keepUnusedDataFor: 60,
    }),

    createTransfer: builder.mutation<CreateTransferResponse, CreateTransferDto>({
      query: (body) => ({ url: '/transfers', method: 'POST', body, validateStatus: okIfNoError }),
      invalidatesTags: ['Wallets'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyWalletsQuery,
  useCreateTransferMutation,
} = walletsApi;