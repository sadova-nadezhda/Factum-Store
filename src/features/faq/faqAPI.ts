import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';

export type FaqItem = { id: string; question: string; answer: string };

export const faqApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getFaq: build.query<FaqItem[], void>({
      query: () => ({ url: '/faq', method: 'GET', validateStatus: okIfNoError }),
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
  overrideExisting: false,
});

export const { useGetFaqQuery } = faqApi;