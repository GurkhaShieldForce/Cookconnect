import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ChefDashboard from './pages/dashboard/ChefDashboard';
import { authService } from './utils/auth/authService';

export default function App() {
  const user = authService.getCurrentUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chef-profile" element={<ChefProfile />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/chef/dashboard" element={<ChefDashboard />} />
        <Route path="/dashboard" element={
          user ? (
            <Navigate to={`/${user.userType}/dashboard`} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/github/callback" element={<GithubCallback />} />
      </Routes>
    </Router>
  );
}