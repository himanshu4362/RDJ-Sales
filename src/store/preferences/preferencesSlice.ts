// src/store/preferences/preferencesSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  // Reserved for future business preferences
  language: 'en' | 'hi';
  compactMode: boolean;
  defaultWarehouseId: string | null;
}

const initialState: PreferencesState = {
  language: 'en',
  compactMode: false,
  defaultWarehouseId: null,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    // Toggles and setters will be implemented as business needs arise
    setLanguage: (state, action: PayloadAction<PreferencesState['language']>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = preferencesSlice.actions;
export default preferencesSlice.reducer;