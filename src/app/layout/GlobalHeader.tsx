import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../common/theme/useTheme';
import { ROUTES } from '../navigation/routes';

export const GlobalHeader: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();

  // Pure UI logic: Cycles through the available theme preferences
  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  // Visually represent the active state using Lucide icons exclusively
  const ThemeIcon = theme === 'system' ? Monitor : (actualTheme === 'dark' ? Moon : Sun);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-default bg-surface-primary px-4 shadow-sm">
      <div className="flex items-center">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          {/* Industrial Brand Mark */}
          <div className="flex h-10 w-10 items-center justify-center rounded bg-brand-primary font-bold text-surface-primary shadow-sm">
            RDJ
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">
            Ravi DJ
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Theme Toggle - Enforces the minimum 48x48px (h-12 w-12) touch target rule */}
        <button
          onClick={cycleTheme}
          className="flex h-12 w-12 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          aria-label={`Toggle Theme. Current: ${theme}`}
          title={`Current Theme: ${theme}`}
        >
          <ThemeIcon size={24} strokeWidth={2} />
        </button>
        
        {/* Future Authentication / Profile Avatar will mount here */}
      </div>
    </header>
  );
};