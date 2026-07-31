import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/pages/LoginPage/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage/RegisterPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
