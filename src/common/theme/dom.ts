import type { ActualTheme } from './types';

export const applyThemeToDOM = (actualTheme: ActualTheme): void => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  
  // We only set the actual visual theme to the DOM, never 'system'
  root.removeAttribute('data-theme');
  root.setAttribute('data-theme', actualTheme);
};