import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type EventItem = {
  type: 'events' | 'monthly' | 'annual' | string;
  title: string;
  reward: number;
};
type EventsResponse = { items: EventItem[] };

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.BASE_URL, 
    credentials: 'omit',
  }),
  endpoints: (build) => ({
    getEvents: build.query<EventItem[], void>({
      query: () => 'mock/events.json',
      transformResponse: (resp: EventsResponse) => resp?.items ?? [],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetEventsQuery } = eventsApi;