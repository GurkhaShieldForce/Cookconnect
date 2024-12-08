// src/pages/auth/Register.tsx
import { RegisterForm } from '../../components/auth/RegisterForm';
import { AuthTabs } from '../../components/auth/AuthTabs';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useState } from 'react';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'customer' | 'chef'>('customer');

  return (
    <AuthLayout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Create Your Account
        </h1>
        <AuthTabs activeTab={userType} onTabChange={setUserType} />
        <RegisterForm userType={userType} />
      </div>
    </AuthLayout>
  );
}