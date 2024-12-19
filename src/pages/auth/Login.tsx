// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';
import { SocialLogin } from '../../components/auth/SocialLogin';
import { authService } from '../../utils/auth/authService';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (formData: { email: string; password: string }) => {
        try {
            setIsLoading(true);
            const response = await authService.login(formData.email, formData.password);
            navigate(response.user.userType === 'chef' ? '/chef/dashboard' : '/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // Here we would typically show an error message to the user
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