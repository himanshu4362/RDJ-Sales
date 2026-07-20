// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { baseApi } from './api/baseApi';

/**
 * Checklist Verification: Store initialization has ZERO business knowledge.
 * It only knows about infrastructure (auth, api).
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;