// src/types/menu.types.ts

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    courseType: 'appetizer' | 'main' | 'dessert' | 'side' | 'beverage';
    price?: number;  // Optional for per-item pricing
    dietaryInfo: {
        vegetarian?: boolean;
        vegan?: boolean;
        glutenFree?: boolean;
        dairyFree?: boolean;
        nutFree?: boolean;
        spiceLevel?: 'mild' | 'medium' | 'hot';
    };
    ingredients: string[];
    allergens: string[];
    preparationTime: number; // in minutes
}

export interface Menu {
    _id: string | { $oid: string };
    id?: string;
    chefId: string;
    name: string;
    description: string;
    items: MenuItem[];
    pricePerPerson: number;
    minimumGuests: number;
    maximumGuests: number;
    preparationTime: number; // Total preparation time in minutes
    availableDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    advanceNotice: number; // Required notice in hours
    status: 'draft' | 'active' | 'inactive';
    cuisine: string[];
    specialRequirements?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MenuValidationError {
    field: string;
    message: string;
}

export interface MenuBuilderProps {
    chefId: string;
    existingMenu?: Menu;
    onSave: (menu: Menu) => Promise<void>;
    onCancel: () => void;
}

// Component Props Types
export interface MenuItemFormProps {
    item: MenuItem;
    onChange: (item: MenuItem) => void;
    onDelete: () => void;
}

export interface MenuDisplayProps {
    menu: Menu;
    onSelect?: () => void;
    showPricing?: boolean;
}