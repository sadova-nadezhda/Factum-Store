import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const AuthRequiredRoute: React.FC = () => {
  const location = useLocation();
  const token =
    useSelector((state: RootState) => state.auth?.token) ||
    localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AuthRequiredRoute;