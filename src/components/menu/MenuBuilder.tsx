// src/components/menu/MenuBuilder.tsx

import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { Menu, MenuItem, MenuBuilderProps } from '../../types/menu.types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

const defaultMenuItem: MenuItem = {
    id: '',
    name: '',
    description: '',
    courseType: 'main',
    dietaryInfo: {},
    ingredients: [],
    allergens: [],
    preparationTime: 30
};

export function MenuBuilder({ chefId, existingMenu, onSave, onCancel }: MenuBuilderProps) {
    const { user } = useUser();
    if (!user || user.id !== chefId) {
        return <div>Unauthorized access</div>;
    }
    const [menu, setMenu] = useState<Menu>({
        _id: existingMenu?._id || { $oid: crypto.randomUUID() },
        id: existingMenu?.id || crypto.randomUUID(),
        chefId,
        name: existingMenu?.name || '',
        description: existingMenu?.description || '',
        items: existingMenu?.items || [],
        pricePerPerson: existingMenu?.pricePerPerson || 0,
        minimumGuests: existingMenu?.minimumGuests || 2,
        maximumGuests: existingMenu?.maximumGuests || 10,
        preparationTime: existingMenu?.preparationTime || 0,
        availableDays: existingMenu?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        advanceNotice: existingMenu?.advanceNotice || 24,
        status: existingMenu?.status || 'draft',
        cuisine: existingMenu?.cuisine || [],
        createdAt: existingMenu?.createdAt || new Date(),
        updatedAt: existingMenu?.updatedAt || new Date()
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingMenu) {
            setMenu(existingMenu);
        }
    }, [existingMenu]);

    const validateMenu = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!menu.name.trim()) {
            newErrors.name = 'Menu name is required';
        }
        if (menu.items.length === 0) {
            newErrors.items = 'At least one menu item is required';
        }
        if (menu.pricePerPerson <= 0) {
            newErrors.pricePerPerson = 'Price per person must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddItem = () => {
        const newItem: MenuItem = {
            ...defaultMenuItem,
            id: crypto.randomUUID()
        };
        setMenu({
            ...menu,
            items: [...menu.items, newItem]
        });
    };

    const handleItemChange = (itemId: string, updatedItem: MenuItem) => {
        setMenu({
            ...menu,
            items: menu.items.map(item => 
                item.id === itemId ? updatedItem : item
            )
        });
    };

    const handleDeleteItem = (itemId: string) => {
        setMenu({
            ...menu,
            items: menu.items.filter(item => item.id !== itemId)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateMenu()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                ...menu,
                updatedAt: new Date()
            });
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Failed to save menu'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Menu Information */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Menu Name"
                        value={menu.name}
                        onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                        error={errors.name}
                        required
                    />
                    <Input
                        label="Price Per Person"
                        type="number"
                        value={menu.pricePerPerson.toString()}
                        onChange={(e) => setMenu({ ...menu, pricePerPerson: parseFloat(e.target.value) })}
                        error={errors.pricePerPerson}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="menuDescription">
                        Description
                    </label>
                    <textarea
                        id="menuDescription"
                        placeholder="Enter menu description"
                        value={menu.description}
                        onChange={(e) => setMenu({ ...menu, description: e.target.value })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        rows={3}
                    />
                </div>

                {/* Menu Items Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Menu Items</h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddItem}
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add Item
                        </Button>
                    </div>

                    {errors.items && (
                        <p className="text-sm text-red-600">{errors.items}</p>
                    )}

                    <div className="space-y-4">
                        {menu.items.map((item) => (
                            <div key={item.id} className="rounded-lg border p-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Input
                                        label="Item Name"
                                        value={item.name}
                                        onChange={(e) => handleItemChange(item.id, { ...item, name: e.target.value })}
                                        required
                                    />
                                    <select
                                        title="Course Type"
                                        id={`courseType-${item.id}`}
                                        name={`courseType-${item.id}`}
                                        value={item.courseType}
                                        onChange={(e) => handleItemChange(item.id, { ...item, courseType: e.target.value as MenuItem['courseType'] })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    >
                                        <option value="appetizer">Appetizer</option>
                                        <option value="main">Main Course</option>
                                        <option value="dessert">Dessert</option>
                                        <option value="side">Side Dish</option>
                                        <option value="beverage">Beverage</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        title="Item Description"
                                        placeholder="Enter item description"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(item.id, { ...item, description: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        rows={2}
                                    />
                                </div>

                                <button
                                    type="button"
                                    aria-label={`Delete ${item.name || 'menu item'}`}
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="mt-4 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {errors.submit && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {errors.submit}
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Menu'}
                    </Button>
                </div>
            </form>
        </div>
    );
}