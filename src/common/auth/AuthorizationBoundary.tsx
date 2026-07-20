import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../app/navigation/routes';
import { useAppSelector } from '../../store/hooks';

/**
 * Responsibility: Intercepts access to the Action Zone.
 * Architecture Contract: Enforces authorization via the global Data Infrastructure (Redux)
 * while preserving the user's intended destination.
 */
export const AuthorizationBoundary: React.FC = () => {
  const location = useLocation();
  
  // Single Source of Truth: Reads directly from the infrastructure layer
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated); 

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};