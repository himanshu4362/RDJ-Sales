import { createContext } from 'react';
import { Theme, ActualTheme } from './types';

export interface ThemeContextValue {
  theme: Theme;            // e.g., 'system'
  actualTheme: ActualTheme; // e.g., 'dark'
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);