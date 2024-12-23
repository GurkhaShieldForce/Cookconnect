// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';
import { SocialLogin } from '../../components/auth/SocialLogin';
import { authService } from '../../utils/auth/authService';
import { LoginFormData } from '../../types/auth.types';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (formData: LoginFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await authService.login(formData.email, formData.password);
            
            // Navigate based on user type
            if (response.user.userType === 'chef') {
                navigate('/chef/dashboard');
            } else {
                navigate('/customer/dashboard'); // Note: Changed from '/dashboard' to be more specific
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="container mx-auto px-6 py-12">
                <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    Welcome Back
                </h1>
                <div className="mx-auto max-w-md">
                    <div className="rounded-xl bg-white p-8 shadow-xl">
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <LoginForm 
                            onSubmit={handleLogin}
                            isLoading={isLoading}
                        />
                        <div className="mt-6">
                            <SocialLogin />
                        </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-orange-600 hover:text-orange-700">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}