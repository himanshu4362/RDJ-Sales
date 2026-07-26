import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import type { Theme, ActualTheme } from './types';
import { getStoredTheme, setStoredTheme } from './storage';
import { resolveTheme } from './resolver';
import { applyThemeToDOM } from './dom';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [actualTheme, setActualTheme] = useState<ActualTheme>(() => resolveTheme(getStoredTheme()));

  // Coordinator: Sync DOM and actual visual state when user preference changes
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setActualTheme(resolved);
    applyThemeToDOM(resolved);
  }, [theme]);

  // Coordinator: Listen to OS-level changes ONLY if 'system' is selected
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = () => {
      const resolved = resolveTheme('system');
      setActualTheme(resolved);
      applyThemeToDOM(resolved);
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setStoredTheme(newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};