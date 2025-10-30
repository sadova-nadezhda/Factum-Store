import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/baseQuery';


export type EventItem = {
  type: 'events' | 'monthly' | 'annual' | string;
  title: string;
  reward: number;
};

type EventsResponse = { items: EventItem[] };

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery,
  endpoints: (build) => ({
    getEvents: build.query<EventItem[], void>({
      query: () => ({
        url: '/activity',
        method: 'GET',
      }),
      transformResponse: (resp: EventsResponse | EventItem[]) => {
        const raw = Array.isArray(resp) ? resp : resp?.items ?? [];
        const norm = (t: string) =>
          t === 'event' ? 'events'
          : t === 'month' ? 'monthly'
          : (t === 'year' || t === 'quarter') ? 'annual'
          : t;
        return raw.map(it => ({ ...it, type: norm(it.type) }));
      },
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetEventsQuery } = eventsApi;