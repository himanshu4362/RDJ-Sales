import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ROUTES } from './navigation/routes';
import { AuthorizationBoundary } from '../common/auth/AuthorizationBoundary';

// Feature Pages
import { CatalogListPage } from '../features/catalog/pages/CatalogListPage';
import { ProductDetailsPage } from '../features/catalog/pages/ProductDetailsPage';
import { CreateProductPage } from '../features/catalog/pages/CreateProductPage';
import { EditProductPage } from '../features/catalog/pages/EditProductPage';

const Orders = () => <h1 className="p-8 font-bold text-2xl text-text-primary">Action Zone (Protected)</h1>;
const NotFound = () => <h1 className="p-8 font-bold text-2xl text-text-primary">404 - Not Found</h1>;

export const AppRouter = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />, 
    children: [
      { index: true, element: <Navigate to={ROUTES.CATALOG} replace /> },
      
      { 
        path: ROUTES.CATALOG, 
        children: [
          { index: true, element: <CatalogListPage /> },
          // The "new" route MUST be placed before the dynamic ":slug" route
          { path: 'new', element: <CreateProductPage /> },
          { path: ':slug', element: <ProductDetailsPage /> },
          { path: ':slug/edit', element: <EditProductPage /> },
        ]
      },
      
      {
        element: <AuthorizationBoundary />,
        children: [
          { path: ROUTES.ORDERS, element: <Orders /> },
        ]
      },
      
      { path: '*', element: <NotFound /> }
    ],
  },
]);