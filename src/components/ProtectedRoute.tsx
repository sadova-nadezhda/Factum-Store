import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/store';

export default function ProtectedRoute() {

  const token = useAppSelector((state) => state.auth.token) || localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}