import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.token ?? localStorage.getItem('token');
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});