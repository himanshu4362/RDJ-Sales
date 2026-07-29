import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Member, Session } from '../../features/account/domain/account.types';
import { SessionStorageService } from '../../common/utils/storage';

export interface AuthState {
  isAuthenticated: boolean;
  session: Session | null;
  member: Member | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  session: null,
  member: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ session: Session; member: Member }>
    ) => {
      state.session = action.payload.session;
      state.member = action.payload.member;
      state.isAuthenticated = true;

      // Persistence contract integration
      SessionStorageService.save(action.payload.session, action.payload.member);
    },
    logout: (state) => {
      state.session = null;
      state.member = null;
      state.isAuthenticated = false;

      SessionStorageService.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;