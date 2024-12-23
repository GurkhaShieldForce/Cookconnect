// src/types/chef.types.ts
export interface Chef {
  id: string;
  name: string;
  cuisine: string;
  specialty?: string;
  bio?: string;
  experience?: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  location: string;
  availability?: string;
  certifications?: string[];
  specialties: string[];
  serviceAreas: string[];
}


export interface Certification {
  title: string;
  organization: string;
}