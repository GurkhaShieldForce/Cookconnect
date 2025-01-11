// src/pages/auth/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import AuthLayout from '../../layouts/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import AuthTabs from '../../components/auth/AuthTabs';
import { SocialLogin } from '../../components/auth/SocialLogin';
import { authService } from '../../utils/auth/authService';
import type { SignupFormData } from '../../types/auth.types';

export default function RegisterPage() {
    const navigate = useNavigate(); // Add this hook
    const [userType, setUserType] = useState<'customer' | 'chef'>('customer');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Add error state

    const handleRegister = async (formData: SignupFormData) => {
        try {
            setIsLoading(true);
            setError(null); // Clear any previous errors

            // Log the data being sent for debugging
            console.log('Attempting registration with:', {
                ...formData,
                userType,
                profile: {
                    firstName: formData.profile?.firstName || '',
                    lastName: formData.profile?.lastName || '',
                    bio: formData.profile?.bio || '',
                    specialties: formData.profile?.specialties || ''
                }
            });

            // Call the authentication service to register
            const response = await authService.signupWithEmail({
                ...formData,
                userType,
                profile: {
                    firstName: formData.profile?.firstName || '',
                    lastName: formData.profile?.lastName || '',
                    bio: formData.profile?.bio || '',
                    specialties: formData.profile?.specialties || ''
                }
            });

            // Store the authentication token
            localStorage.setItem('authToken', response.token);
            
            // Store user information
            localStorage.setItem('user', JSON.stringify(response.user));

            // Navigate based on user type
            if (response.user.userType === 'chef') {
                navigate('/chef/dashboard');
            } else {
                navigate('/customer/dashboard');
            }

        } catch (error) {
            console.error('Registration error:', error);
            setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
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
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}
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