// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import BookingPage from './pages/booking/BookingPage';
import PaymentPage from './pages/booking/PaymentPage';
import ChefProfilePage from './pages/chef/ChefProfile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/chef/:id" element={<ChefProfilePage />} />
      </Routes>
    </Router>
  );
}