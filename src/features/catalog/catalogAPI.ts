import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../types/ProductTypes';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV
      ? '/api'
      : 'https://merch.factum.work/api',
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { q?: string; sort?: 'price_asc' | 'price_desc' } | void>({
      query: (args) => {
        const q = args && 'q' in args ? args.q ?? '' : '';
        const sort = args && 'sort' in args ? args.sort : undefined;
        return { url: 'products', params: { q, sort } };
      },
    }),
  }),
});

export const { useGetProductsQuery } = catalogApi;
