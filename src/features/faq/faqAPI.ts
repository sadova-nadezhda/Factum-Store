import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FaqResponse } from '../../types/FaqTypes';

export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV
      ? '/api'                          
      : 'https://merch.factum.work/api'
  }),
  endpoints: (builder) => ({
    getFaq: builder.query<FaqResponse, void>({
      query: () => 'faq',
    }),
  }),
});

export const { useGetFaqQuery } = faqApi;