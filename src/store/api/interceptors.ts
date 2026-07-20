import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { rawBaseQuery } from './baseQuery';
import { logout } from '../auth/authSlice';

export const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    // TODO (Category B UX): Dispatch global notification: "Your session expired. Please sign in again."
  }

  if (result.error && result.error.status === 'FETCH_ERROR') {
    // TODO (Category B Logging): Replace console with a centralized infrastructure logging system
    console.error('[Transport Policy] Network request failed.');
  }

  return result;
};