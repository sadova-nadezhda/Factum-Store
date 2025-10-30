import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute'; 
import Header from './components/Header';
import Footer from './components/Footer';
import { ProfileInfo, ProfileHistory, ProfileNotif, ProfileCoins } from './components/Profile';
import { 
  ForgotPasswordPage, HomePage, LoginPage, NotFoundPage, 
  ProfilePage, RegisterPage, ResetPasswordPage, CatalogPage, 
  EventsPage
} from './pages';

import './styles/main.scss';

function App() {
  const location = useLocation();
  return (
    <>
      <main>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/events" element={<EventsPage />} />

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
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
    </>
  );
}

export default App;