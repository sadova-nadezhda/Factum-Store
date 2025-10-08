import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://merch.factum.work/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.token ?? localStorage.getItem('token');
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});