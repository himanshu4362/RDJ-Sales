import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ROUTES } from './navigation/routes';
import { AuthorizationBoundary } from '../common/auth/AuthorizationBoundary';

/**
 * Responsibility: The routing engine composing layout, navigation, and authorization.
 * Architecture Contract: Defines zone boundaries and strictly handles dead-end routing (404) 
 * independently of runtime exceptions.
 */

// Placeholder Pages - Will be extracted in Phase 2B (Business Features)
const Home = () => <h1>Discovery Zone</h1>;
const Catalog = () => <h1>Catalog Zone</h1>;
const Orders = () => <h1>Action Zone (Protected)</h1>;
const NotFound = () => <h1>Product Not Found (404)</h1>;

export const AppRouter = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />, // Persistent Shell
    // errorElement: <GlobalErrorBoundary />, // Reserved for future runtime exceptions
    children: [
      // Discovery Zone (Public Access)
      { index: true, element: <Home /> },
      { path: ROUTES.CATALOG, element: <Catalog /> },
      
      // Action Zone (Protected Access)
      {
        element: <AuthorizationBoundary />,
        children: [
          { path: ROUTES.ORDERS, element: <Orders /> },
        ]
      },
      
      // Dead End Routing (404)
      { path: '*', element: <NotFound /> }
    ],
  },
]);