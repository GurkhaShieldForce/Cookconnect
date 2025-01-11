// src/types/chef.types.ts
export interface Chef {
  id: string;
  name: string;
  cuisine: string | string[];
  location: string;
  profile: {
    firstName: string;
    lastName: string;
    bio: string;
    specialties: string[];
    location: string;
    yearsOfExperience?: number;
    certifications?: string[];
    availableForBooking?: boolean;
  };
  rating: number;
  reviews: number;
  imageUrl?: string;
  pricing?: {
    baseRate: number;
    minimumGuests?: number;
  };
  availability?: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
  };
}


export interface Certification {
  title: string;
  organization: string;
}