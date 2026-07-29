import React from 'react';
// NEW: Import NavLink
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, Monitor, LogOut, Search, Package, ShieldCheck, Wrench, MessageSquare, User } from 'lucide-react';
import { useTheme } from '../../common/theme/useTheme';
import { ROUTES } from '../navigation/routes';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/auth/authSlice';
import { Button } from '../../common/components/ui/Button';

export const GlobalHeader: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();
  const { isAuthenticated, member } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  const ThemeIcon = theme === 'system' ? Monitor : (actualTheme === 'dark' ? Moon : Sun);
  const role = member?.identity.role;
  const displayName = member?.profile.displayName ?? '';
  const initial = displayName.charAt(0).toUpperCase() || (role === 'admin' ? 'A' : 'M');

  const roleStyles = role === 'admin'
    ? { badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20', avatar: 'bg-amber-500' }
    : { badge: 'bg-sky-500/10 text-sky-600 border-sky-500/20', avatar: 'bg-sky-500' };

  // Helper for NavLink styling
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-1.5 text-sm font-bold transition-colors ${isActive ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`;

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-default bg-surface-primary px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-brand-primary font-bold text-surface-primary shadow-sm">RDJ</div>
          <span className="text-xl font-bold tracking-tight text-text-primary">Rana Sales</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          
          {/* Guest & Member Catalog */}
          {(!isAuthenticated || role === 'member') && (
            <NavLink to={ROUTES.CATALOG} className={navLinkClass}>
              Catalog
            </NavLink>
          )}

          {/* Member Workspace Navigation */}
          {isAuthenticated && role === 'member' && (
            <>
              <NavLink to={ROUTES.MEMBER_HOME} className={navLinkClass}>
                <Package size={15} strokeWidth={2.5} /> My Orders
              </NavLink>
              <span className="flex items-center gap-1.5 text-sm font-bold text-text-muted cursor-not-allowed" title="Available in future">
                <MessageSquare size={15} strokeWidth={2.5} /> Communication
              </span>
            </>
          )}

          {/* Ravi Admin Workspace Navigation */}
          {isAuthenticated && role === 'admin' && (
            <>
              <NavLink to={ROUTES.ADMIN_WORKSPACE} className={({ isActive }) => `flex items-center gap-1.5 text-sm font-bold transition-colors ${isActive ? 'text-amber-600' : 'text-text-secondary hover:text-text-primary'}`} end>
                <ShieldCheck size={15} strokeWidth={2.5} /> Workspace Hub
              </NavLink>
              <NavLink to={ROUTES.ADMIN_CATALOG} className={navLinkClass}>
                 Manage Catalog
              </NavLink>
              <NavLink to={ROUTES.ORDERS} className={navLinkClass}>
                <Package size={15} strokeWidth={2.5} /> Orders
              </NavLink>
              <NavLink to={ROUTES.OPPORTUNITIES} className={navLinkClass}>
                <Wrench size={15} strokeWidth={2.5} /> Pipeline
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-secondary transition-colors" title="Search">
            <Search size={18} strokeWidth={2} />
          </button>
        )}

        <button onClick={cycleTheme} className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-secondary transition-colors" title={`Theme: ${theme}`}>
          <ThemeIcon size={20} strokeWidth={2} />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 border-l border-border-default pl-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${roleStyles.avatar} text-white text-sm font-bold shrink-0`}>
              {initial}
            </div>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-text-primary">{displayName}</span>
              <span className={`inline-flex w-max items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleStyles.badge}`}>
                {role}
              </span>
            </div>
            <button onClick={handleLogout} className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-500/10 transition-colors" title="Sign Out">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Button onClick={() => navigate(ROUTES.LOGIN)} variant="secondary" className="h-10 px-5 text-xs font-bold">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};