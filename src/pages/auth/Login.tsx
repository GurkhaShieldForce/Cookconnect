// src/pages/auth/Login.tsx
import { LoginForm } from '../../components/auth/LoginForm';
import { AuthLayout } from '../../layouts/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome Back
        </h1>
        <LoginForm />
      </div>
    </AuthLayout>
  );
}