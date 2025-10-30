import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';

import type { Product } from '@/types/ProductTypes';

export type GetProductsArgs = { q?: string; sort?: string } | void;

export const catalogApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], GetProductsArgs>({
      query: (args) => {
        const q = (args as any)?.q?.trim?.();
        const sort = (args as any)?.sort?.trim?.();
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (sort) params.set('sort', sort);
        const qs = params.toString();
        return { url: `/products${qs ? `?${qs}` : ''}`, method: 'GET', validateStatus: okIfNoError };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Products' as const, id: String((p as any).id) })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'GET', validateStatus: okIfNoError }),
      providesTags: (_res, _err, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 120,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
} = catalogApi;
