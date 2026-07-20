import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const rawBaseQuery = fetchBaseQuery({
  // Category B: Using environment variables immediately
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.session?.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('x-client-version', '1.0.0');
    headers.set('x-client-platform', 'web');
    return headers;
  },
});