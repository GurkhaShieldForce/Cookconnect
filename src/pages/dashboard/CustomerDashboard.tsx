// src/pages/dashboard/CustomerDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { authService } from '../../utils/auth/authService';
import { UserProfile } from '../../utils/auth/types';

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const userProfile = await authService.getUserProfile();
                if (!userProfile) {
                    navigate('/profile/setup');
                    return;
                }
                setProfile(userProfile);
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [navigate]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex min-h-screen items-center justify-center">
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, {profile?.fullName || 'User'}</h1>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">Your Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-800">{profile?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Location</label>
                                <p className="text-gray-800">{profile?.location || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                        <p className="text-gray-600">No recent activity to display.</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}