import React, { useEffect, useState } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ROUTES } from './navigation/routes';
import { AuthorizationBoundary } from '../common/auth/AuthorizationBoundary';
import { useAppDispatch } from '../store/hooks';
import { setCredentials, logout } from '../store/auth/authSlice';
import { SessionStorageService } from '../common/utils/storage';

// --- Page Imports ---
import { PublicHomePage } from './pages/PublicHomePage';
import { SignInRegisterWorkspace } from '../features/account/public/pages/SignInRegisterWorkspace';
import { PublicCatalogPage } from '../features/catalog/public/pages/PublicCatalogPage';
import { PublicProductDetailsPage } from '../features/catalog/public/pages/PublicProductDetailsPage';
import { MemberHomePage } from '../features/account/public/pages/MemberHomePage';
import { AdminWorkspacePage } from './pages/AdminWorkspacePage';
import { AdminOpportunityListPage } from '../features/sales-opportunity/admin/pages/AdminOpportunityListPage';
import { AdminOpportunityDetailsPage } from '../features/sales-opportunity/admin/pages/AdminOpportunityDetailsPage';
import { AdminCatalogListPage, AdminProductDetailsPage, AdminCreateProductPage, AdminEditProductPage } from '../features/catalog';
import { AdminOrderListPage } from '../features/orders/admin/pages/AdminOrderListPage';
import { AdminOrderWorkspacePage } from '../features/orders/admin/pages/AdminOrderWorkspacePage';

const Placeholder = ({ title }: { title: string }) => <div className="p-8 text-center"><h1 className="font-bold text-2xl text-text-primary">{title} Module</h1><p className="text-text-secondary">Under Construction</p></div>;
const NotFound = () => <h1 className="p-8 font-bold text-2xl text-text-primary text-center mt-20">404 - Not Found</h1>;

// --- ApplicationBoot: restores session on load, gates render until resolved ---
const ApplicationBoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBooting, setIsBooting] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const persisted = SessionStorageService.get();

    if (persisted) {
      if (new Date(persisted.session.expiresAt) > new Date()) {
        dispatch(setCredentials(persisted));
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }

    setIsBooting(false);
  }, [dispatch]);

  if (isBooting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-secondary">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-primary font-black text-surface-primary text-3xl mb-6 shadow-md">
          RDJ
        </div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Preparing your workspace...</h2>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppRouter = createBrowserRouter([
  {
    element: <ApplicationBoot><AppLayout /></ApplicationBoot>,
    children: [
      // 1. DISCOVERY ZONE (Public)
      { path: ROUTES.HOME, element: <PublicHomePage /> },
      { path: 'catalog', element: <PublicCatalogPage /> },
      { path: 'catalog/:slug', element: <PublicProductDetailsPage /> },
      { path: 'login', element: <SignInRegisterWorkspace /> },

      // 2. MEMBER ZONE (Protected — strictly 'member', no admin crossover)
      {
        element: <AuthorizationBoundary allowedRoles={['member']} />,
        children: [
          { path: 'member', element: <MemberHomePage /> },
        ]
      },

      // 3. ADMINISTRATIVE ZONE (Protected — strictly 'admin', no member crossover)
      {
        element: <AuthorizationBoundary allowedRoles={['admin']} />,
        children: [
          { path: 'admin', element: <AdminWorkspacePage /> },
          { path: 'admin/catalog', children: [
              { index: true, element: <AdminCatalogListPage /> },
              { path: 'new', element: <AdminCreateProductPage /> },
              { path: ':slug', element: <AdminProductDetailsPage /> },
              { path: ':slug/edit', element: <AdminEditProductPage /> },
          ]},
          { path: 'admin/opportunities', element: <AdminOpportunityListPage /> },
          { path: 'admin/opportunities/:id', element: <AdminOpportunityDetailsPage /> },
          { path: 'admin/orders', element: <AdminOrderListPage /> },
          { path: 'admin/orders/:id', element: <AdminOrderWorkspacePage /> },
          { path: 'admin/repairs', element: <Placeholder title="Repairs" /> },
          { path: 'admin/vip', element: <Placeholder title="Appointments" /> },
        ]
      },

      // 4. FALLBACKS
      { path: '*', element: <NotFound /> }
    ],
  },
]);