import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Me', 'Wallets', 'Users', 'Products', 'Product', 'Faq', 'Events'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

export type RootApi = typeof rootApi;
