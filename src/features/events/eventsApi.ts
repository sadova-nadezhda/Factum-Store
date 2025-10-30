import { rootApi } from '@/shared/rootApi';
import { okIfNoError } from '@/shared/rtkValidate';

export type EventKind = 'events' | 'monthly' | 'annual' | (string & {});
export type EventItem = {
  id: string | number;
  type: EventKind;
  title: string;
  reward: number;
};

type EventsResponse = { items: EventItem[] } | EventItem[];

export const eventsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query<EventItem[], void>({
      query: () => ({
        url: '/activity',
        method: 'GET',
        validateStatus: okIfNoError,
      }),
      transformResponse: (resp: EventsResponse): EventItem[] => {
        const raw = Array.isArray(resp) ? resp : resp?.items ?? [];
        const norm = (t?: string): EventKind =>
          t === 'event' ? 'events'
          : t === 'month' ? 'monthly'
          : (t === 'year' || t === 'quarter') ? 'annual'
          : (t ?? 'events');

        return raw.map((it: any) => ({
          id: it?.id,
          title: it?.title ?? '',
          type: norm(it?.type),
          reward: Number(it?.reward ?? 0),
        }));
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((i) => ({ type: 'Events' as const, id: String(i.id) })),
              { type: 'Events' as const, id: 'LIST' },
            ]
          : [{ type: 'Events' as const, id: 'LIST' }],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const { useGetEventsQuery } = eventsApi;