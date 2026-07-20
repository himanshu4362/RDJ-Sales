import { Theme, ActualTheme } from './types';

export const resolveTheme = (theme: Theme): ActualTheme => {
  if (theme === 'system') {
    // If window is undefined (e.g., SSR), safely default to light
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};