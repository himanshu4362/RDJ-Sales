import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../app/navigation/routes';
import { useAppSelector } from '../../store/hooks';
import type { MemberRole } from '../../features/account/domain/account.types';

interface AuthBoundaryProps {
  allowedRoles?: MemberRole[];
}

export const AuthorizationBoundary: React.FC<AuthBoundaryProps> = ({ allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, member } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !member) {
    // Rule #14: Capture exact destination and intent passed by components
    const intendedContext = location.pathname + location.search + location.hash;
    const intent = (location.state as any)?.intent;
    
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: intendedContext, intent }} />;
  }

  // AuthZ Check
  if (allowedRoles && !allowedRoles.includes(member.identity.role)) {
    return <Navigate to={member.identity.role === 'admin' ? ROUTES.ADMIN_WORKSPACE : ROUTES.MEMBER_HOME} replace />;
  }

  return <Outlet />;
};