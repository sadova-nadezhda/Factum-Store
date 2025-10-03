import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FaqResponse } from '../../types/FaqTypes';


export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getFaq: builder.query<FaqResponse, void>({
      query: () => 'faq.json',
    }),
  }),
});

export const { useGetFaqQuery } = faqApi;
