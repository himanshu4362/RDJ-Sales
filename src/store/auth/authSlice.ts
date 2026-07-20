// src/store/auth/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  session: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
  } | null;
  user: {
    id: string;
    role: 'customer' | 'admin' | 'dealer';
    name: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  session: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ session: AuthState['session']; user: AuthState['user'] }>
    ) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.session = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;