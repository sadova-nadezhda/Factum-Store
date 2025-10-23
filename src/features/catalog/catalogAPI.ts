import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/baseQuery';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description: string;
};

type Sort = 'price_asc' | 'price_desc';
type GetProductsArgs = { q?: string; sort?: Sort };

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery,
  tagTypes: ['Products', 'Product'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (build) => ({
    getProducts: build.query<Product[], GetProductsArgs | void>({
      query: (args) => {
        const p = args ?? {};
        const params = Object.fromEntries(
          Object.entries({
            q: p.q?.trim() || undefined,
            sort: p.sort || undefined,
          }).filter(([, v]) => v !== undefined)
        );
        return { url: 'products', params };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const a = queryArgs ?? {};
        return JSON.stringify({ q: a.q ?? '', sort: a.sort ?? '' });
      },
      providesTags: (result) =>
        result && result.length
          ? [
              ...result.map((p) => ({ type: 'Product' as const, id: p.id })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),
    getProduct: build.query<Product, string>({
      query: (id) => ({ url: `products/${id}` }),
      providesTags: (_res, _err, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = catalogApi;