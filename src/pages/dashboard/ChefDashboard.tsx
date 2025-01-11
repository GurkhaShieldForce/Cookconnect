// src/pages/dashboard/ChefDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { authService } from '../../utils/auth/authService';
import type { User } from '../../types/auth.types';
import { ProfileAlert } from '../../components/ProfileAlert';
import { MenuBuilder } from '../../components/menu/MenuBuilder';  // Add this import
import { Button } from '../../components/common/Button';
import { API_BASE_URL } from '../../config/api.config';
import { Menu } from '../../types/menu.types';




export default function ChefDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMenuBuilder, setShowMenuBuilder] = useState(false);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [hasExistingMenu, setHasExistingMenu] = useState(false);

    const fetchMenus = async () => {
        try {
            const token = authService.getAuthToken();
            if (!token) throw new Error('No auth token found');

            const response = await fetch(`${API_BASE_URL}/api/menus`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch menus');
            }

            const data = await response.json();
            setMenus(data);
            setHasExistingMenu(data.length > 0);
            
            // Automatically show menu builder if no menus exist
            if (data.length === 0) {
                setShowMenuBuilder(true);
            }
        } catch (error) {
            console.error('Failed to fetch menus:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch menus');
        }
    };
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = authService.getCurrentUser();

                if (!user) {
                    throw new Error('No authenticated user found');
                }

                const token = authService.getAuthToken();
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch profile');
                }

                const profileData = await response.json();
                setProfile(profileData);
                
                // Fetch menus after profile is loaded
                await fetchMenus();
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
                    <div className="text-lg">Loading your chef dashboard...</div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="container mx-auto px-6 py-8">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                        Error loading profile: {error}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-6 py-8">
                {saveSuccess && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                        Menu saved successfully!
                    </div>
                )}
                
                <ProfileAlert />
                
                {profile && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-6">Welcome, Chef {profile.fullName}</h1>
                        
                        {/* Profile Information Section */}
                        <div className="grid gap-6 md:grid-cols-2 mb-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Profile Information</h2>
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
                                    <p className="font-medium">{profile.profile?.location || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Section */}
                        <div className="border-t pt-8">
                            {!hasExistingMenu && !showMenuBuilder && (
                                <Button
                                    variant="primary"
                                    onClick={() => setShowMenuBuilder(true)}
                                >
                                    Create Your First Menu
                                </Button>
                            )}

                            {showMenuBuilder && (
                                <MenuBuilder
                                    chefId={profile.id}
                                    onSave={async (menu) => {
                                        try {
                                            const token = authService.getAuthToken();
                                            const response = await fetch(`${API_BASE_URL}/api/menus`, {
                                                method: 'POST',
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    ...menu,
                                                    chefId: profile.id
                                                })
                                            });

                                            if (response.ok) {
                                                setSaveSuccess(true);
                                                setShowMenuBuilder(false);
                                                fetchMenus();
                                                setTimeout(() => {
                                                    setSaveSuccess(false);
                                                }, 3000);
                                            }
                                        } catch (error) {
                                            console.error('Failed to save menu:', error);
                                        }
                                    }}
                                    onCancel={() => setShowMenuBuilder(false)}
                                />
                            )}

                            {hasExistingMenu && (
                                <div className="mt-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">Your Menus</h2>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowMenuBuilder(true)}
                                        >
                                            Create Another Menu
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {menus.map(menu => (
                                            <div key={menu.id} className="bg-white border rounded-lg p-4 shadow-sm">
                                                <h3 className="text-lg font-semibold">{menu.name}</h3>
                                                <p className="text-gray-600 mt-2">{menu.description}</p>
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-500">Price per person:</p>
                                                    <p className="font-medium">${menu.pricePerPerson}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Items: {menu.items?.length || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
