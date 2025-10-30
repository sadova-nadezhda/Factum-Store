import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState)?.auth?.token ?? localStorage.getItem('token');
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },

  responseHandler: async (response) => {
    if (response.status === 204) return null;

    const text = await response.text();

    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  },
});
