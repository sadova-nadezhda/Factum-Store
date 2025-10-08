import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/baseQuery';

export type FaqItem = { id: string; question: string; answer: string };

export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery,
  tagTypes: ['Faq'],
  refetchOnMountOrArgChange: false,
  endpoints: (build) => ({
    getFaq: build.query<FaqItem[], void>({
      query: () => 'faq',
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((i) => ({ type: 'Faq' as const, id: i.id })),
              { type: 'Faq' as const, id: 'LIST' },
            ]
          : [{ type: 'Faq' as const, id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetFaqQuery } = faqApi;