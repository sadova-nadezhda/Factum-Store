import React from 'react';
import { Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';

import { ForgotPasswordPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ResetPasswordPage, CatalogPage, FAQPage} from './pages';

import { ProfileInfo, ProfileHistory, ProfileNotif, ProfileCoins} from './components/Profile';

import './styles/main.scss';


function App() {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        {/* <Route path="/faq" element={<FAQPage />} /> */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/profile/*" element={<ProfilePage />}>
          <Route index element={<ProfileInfo />} />
          <Route path="notifications" element={<ProfileNotif />} />
          <Route path="coins" element={<ProfileCoins />} />
          <Route path="history" element={<ProfileHistory />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        
        {/* <Route path="/catalog/:id" element={<ProductPage />} /> */}
      </Routes>
      <Footer />
    </main>
  )
}

export default App;
