import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ROUTES } from './navigation/routes';
import { AuthorizationBoundary } from '../common/auth/AuthorizationBoundary';
import { AdminWorkspacePage } from './pages/AdminWorkspacePage';

import { PublicCatalogPage } from '../features/catalog/public/pages/PublicCatalogPage';
import { PublicProductDetailsPage } from '../features/catalog/public/pages/PublicProductDetailsPage';
import { 
  AdminCatalogListPage, 
  AdminProductDetailsPage, 
  AdminCreateProductPage, 
  AdminEditProductPage 
} from '../features/catalog';

const Placeholder = ({ title }: { title: string }) => <div className="p-8 text-center"><h1 className="font-bold text-2xl text-text-primary">{title} Module</h1><p className="text-text-secondary">Under Construction</p></div>;
const NotFound = () => <h1 className="p-8 font-bold text-2xl text-text-primary text-center mt-20">404 - Not Found</h1>;

export const AppRouter = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />, 
    children: [
      // 1. Discovery Zone (Public)
      { index: true, element: <Navigate to={ROUTES.CATALOG} replace /> },
      { path: 'catalog', element: <PublicCatalogPage /> },
      { path: 'catalog/:slug', element: <PublicProductDetailsPage /> },
      
      // 2. Action & Admin Zones (Protected)
      {
        element: <AuthorizationBoundary />,
        children: [
          // The Workspace Hub
          { path: 'admin', element: <AdminWorkspacePage /> },
          
          // Catalog Module
          { 
            path: 'admin/catalog', 
            children: [
              { index: true, element: <AdminCatalogListPage /> },
              { path: 'new', element: <AdminCreateProductPage /> },
              { path: ':slug', element: <AdminProductDetailsPage /> },
              { path: ':slug/edit', element: <AdminEditProductPage /> },
            ]
          },

          // Future Modules
          { path: 'orders', element: <Placeholder title="Orders" /> },
          { path: 'repairs', element: <Placeholder title="Repairs" /> },
          { path: 'vip', element: <Placeholder title="Appointments" /> },
        ]
      },
      { path: '*', element: <NotFound /> }
    ],
  },
]);