///this page is used to edit the menu
// src/components/menu/MenuList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, PenSquare, Users, Clock, Tag } from 'lucide-react';
import { Menu } from '../../../types/menu.types';
import { Button } from '../../../components/common/Button';
import { api } from '../../../utils/api';

interface MenuListProps {
    chefId: string;
}

export function MenuList({ chefId }: MenuListProps) {
    const navigate = useNavigate();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const { data, error: apiError } = await api.getChefMenus(chefId);
                
                if (apiError) {
                    throw new Error(apiError);
                }

                setMenus(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load menus');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [chefId]);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className="text-center py-8">
                <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Menus Created</h3>
                <p className="text-gray-600 mb-4">Start creating your first menu to showcase your culinary offerings.</p>
                <Button
                    variant="primary"
                    onClick={() => navigate('/chef/menus/create')}
                >
                    Create Your First Menu
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Your Menus</h2>
                <Button
                    variant="primary"
                    onClick={() => navigate('/chef/menus/create')}
                >
                    Create New Menu
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menus.map((menu) => (
                    <div key={menu.id} className="rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">{menu.name}</h3>
                                <span className={`
                                    px-3 py-1 rounded-full text-sm font-medium
                                    ${menu.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                    ${menu.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                                    ${menu.status === 'inactive' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {menu.status.charAt(0).toUpperCase() + menu.status.slice(1)}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                                {menu.description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Tag className="h-4 w-4 mr-2" />
                                    ${menu.pricePerPerson} per person
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-4 w-4 mr-2" />
                                    {menu.minimumGuests}-{menu.maximumGuests} guests
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {menu.preparationTime} minutes prep time
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {menu.cuisine.map((type) => (
                                    <span
                                        key={type}
                                        className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate(`/chef/menus/${menu.id}/edit`)}
                                >
                                    <PenSquare className="h-4 w-4 mr-2" />
                                    Edit Menu
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
