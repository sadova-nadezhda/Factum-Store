import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const GuestOnlyRoute: React.FC = () => {
  const location = useLocation();
  const token =
    useSelector((state: RootState) => state.auth?.token) ||
    localStorage.getItem('token');

  if (token) {
    const redirectTo = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default GuestOnlyRoute;