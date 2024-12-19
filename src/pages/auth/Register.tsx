// src/pages/auth/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { AuthTabs } from '../../components/auth/AuthTabs';
import { SocialLogin } from '../../components/auth/SocialLogin';
import { authService } from '../../utils/auth/authService';
import type { SignupFormData } from '../../types/auth.types';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState<'customer' | 'chef'>('customer');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (formData: SignupFormData) => {
        try {
            setIsLoading(true);
            await authService.signupWithEmail({
                ...formData,
                userType
            });
            navigate(userType === 'chef' ? '/chef/onboarding' : '/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            // Here we would typically show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="container mx-auto px-6 py-12">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    Create Your Account
                </h1>
                <div className="mx-auto max-w-md">
                    <AuthTabs activeTab={userType} onTabChange={setUserType} />
                    <div className="rounded-xl bg-white p-8 shadow-xl">
                        <RegisterForm
                            userType={userType}
                            onSubmit={handleRegister}
                            isLoading={isLoading}
                        />
                        <div className="mt-6">
                            <SocialLogin />
                        </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-orange-600 hover:text-orange-700">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}