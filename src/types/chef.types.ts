  // src/types/chef.types.ts
  export interface ChefService {
    id: string;
    chefId: string;
    name: string;
    description: string;
    price: number;
    minimumGuests: number;
    maximumGuests: number;
    type: 'private_dinner' | 'cooking_class';
  }