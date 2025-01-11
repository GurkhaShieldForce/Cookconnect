// src/pages/dashboard/CustomerDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/auth/authService';
import MainLayout from '../../layouts/MainLayout';
import { ProfileAlert } from '../../components/ProfileAlert';


interface UserProfile {
    fullName: string;
    email: string;
    location?: string;
    isProfileComplete: boolean;
}

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = authService.getCurrentUser();

                if (!user) {
                    throw new Error('No authenticated user found');
                }

                if (user.userType !== 'customer') {
                    navigate('/chef/dashboard');
                    return;
                }

                const token = authService.getAuthToken();
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${authService.getBaseUrl}/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const contentType = response.headers.get('Content-Type');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch profile');
                }

                if (contentType && contentType.includes('application/json')) {
                    const profileData: UserProfile = await response.json();
                    setProfile(profileData);
                } else if (contentType && contentType.includes('text/html')) {
                    const html = await response.text();
                    setHtmlContent(html);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading your customer dashboard...</div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Error loading profile: {error}</div>
                </div>
            </MainLayout>
        );
    }

    if (htmlContent) {
        return (
            <MainLayout>
                 <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome, Customer</h1>
                <ProfileAlert />
                    {profile && (
                        <>
                            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                            <div className="grid gap-4">
                                <div>
                                    <label className="text-gray-600 block">Name</label>
                                    <p className="font-medium">{profile.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-gray-600 block">Email</label>
                                    <p className="font-medium">{profile.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-600 block">Location</label>
                                    <p className="font-medium">{profile.location || 'Not specified'}</p>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Order History</h2>
                        <p className="text-gray-600">Coming soon: View your past orders</p>
                    </div>
                </div>
            </div>
            </MainLayout>
        );
    }
}
