import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import ToastPortal from './components/Modal/ToastPortal';
import { ProfileInfo, ProfileHistory, ProfileNotif, ProfileCoins } from './components/Profile';
import {
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
  CatalogPage,
  EventsPage,
} from './pages';

import AuthRequiredRoute from './components/routes/AuthRequiredRoute';
import GuestOnlyRoute from './components/routes/GuestOnlyRoute';

import './styles/main.scss';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <main>
        <Header />

        <Routes>
          {/* --- Доступно только неавторизованным --- */}
          <Route element={<GuestOnlyRoute />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* --- Доступно только после регистрации (авторизации) --- */}
          <Route element={<AuthRequiredRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/events" element={<EventsPage />} />

            <Route path="/profile/*" element={<ProfilePage />}>
              <Route index element={<ProfileInfo />} />
              <Route path="notifications" element={<ProfileNotif />} />
              <Route path="coins" element={<ProfileCoins />} />
              <Route path="history" element={<ProfileHistory />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </main>

      <Footer />
      <ToastPortal />
      <ToastContainer />
    </>
  );
};

export default App;