// src/App.tsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import ChefProfile from './pages/chef/ChefProfile';
import AboutPage from './pages/about/AboutPage';
import HowItWorksPage from './pages/how-it-works/HowItWorksPage';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import GoogleCallback from './pages/auth/GoogleCallback';
import GithubCallback from './pages/auth/GithubCallback';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chefs" element={<ChefProfile />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chefs" element={<ChefProfile />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
      </Routes>
    </Router>
  );
}