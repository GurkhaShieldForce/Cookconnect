import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/auth/authService';
import MainLayout from '../../layouts/MainLayout';

interface Profile {
    fullName: string;
    email: string;
    location?: string;
    isProfileComplete: boolean;
}

export default function ChefDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log('Fetching current user...');
                const user = authService.getCurrentUser();

                if (!user) {
                    console.log('No user found, redirecting to login...');
                    navigate('/login');
                    return;
                }

                if (user.userType !== 'chef') {
                    console.log('User is not a chef, redirecting to customer dashboard...');
                    navigate('/customer/dashboard');
                    return;
                }

                const token = authService.getAuthToken();
                if (!token) {
                    throw new Error('No authentication token found');
                }

                console.log('Fetching profile data...');
                const response = await fetch(`${authService.getBaseUrl}/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const profileData: Profile = await response.json();
                console.log('Profile data fetched:', profileData);
                setProfile(profileData);

                if (!profileData.isProfileComplete) {
                    console.log('Profile is not complete, redirecting to profile setup...');
                    navigate('/profile/setup');
                }
            } catch (err) {
                console.error('Error loading profile:', err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading your chef dashboard...</div>
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

    return (
        <MainLayout>
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Chef Dashboard</h1>
                    {profile && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Profile Information</h2>
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
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Menu Management</h2>
                                <p className="text-gray-600">Coming soon: Add and manage your menu items</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}