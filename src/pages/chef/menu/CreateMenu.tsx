// src/pages/chef/menu/CreateMenu.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { MenuBuilder } from '../../../components/menu/MenuBuilder';
import { useUser } from '../../../contexts/UserContext';
import { Menu } from '../../../types/menu.types';
import { api } from '../../../config/api.config';



export default function CreateMenu() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [error, setError] = useState<string | null>(null);

    if (!user || user.userType !== 'chef') {
        navigate('/login');
        return null;
    }

    const handleSaveMenu = async (menu: Menu) => {
        try {
            const response = await api.fetch('/api/menus', {
                method: 'POST',
                body: JSON.stringify(menu)
            });

            if (!response.ok) {
                throw new Error('Failed to create menu');
            }

            navigate('/chef/dashboard');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save menu');
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <ChefHat className="h-8 w-8 text-orange-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Create New Menu</h1>
                    </div>
                    <p className="mt-2 text-gray-600">Design your signature menu for your customers</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="rounded-xl bg-white p-6 shadow-lg">
                    <MenuBuilder
                        chefId={user.id}
                        onSave={handleSaveMenu}
                        onCancel={() => navigate('/chef/dashboard')}
                    />
                </div>
            </div>
        </MainLayout>
    );
}