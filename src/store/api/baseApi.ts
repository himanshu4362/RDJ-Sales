import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from './interceptors';
import { CACHE_TAGS } from './tags';

/**
 * The core API slice. 
 * Notice: ZERO business endpoints exist here. This prevents the file from 
 * becoming a 10,000-line bottleneck. Modules will use `baseApi.injectEndpoints()`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: dynamicBaseQuery,
  tagTypes: Object.values(CACHE_TAGS),
  endpoints: () => ({}), // Business modules inject here
});