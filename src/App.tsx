import React, { useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; 

import { 
  ForgotPasswordPage, HomePage, LoginPage, NotFoundPage, 
  ProfilePage, RegisterPage, ResetPasswordPage, CatalogPage 
} from './pages';

import AdminUsersPage from './pages/AdminPage/AdminUsersPage';

import { ProfileInfo, ProfileHistory, ProfileNotif, ProfileCoins } from './components/Profile';

import ProductModal from './components/Modal/ProductModal';

import './styles/main.scss';


function App() {
  const location = useLocation();
  const background = useMemo(() => location.state?.background, [location]);
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile/*" element={<ProfilePage />}>
            <Route index element={<ProfileInfo />} />
            <Route path="notifications" element={<ProfileNotif />} />
            <Route path="coins" element={<ProfileCoins />} />
            <Route path="history" element={<ProfileHistory />} />
          </Route>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;