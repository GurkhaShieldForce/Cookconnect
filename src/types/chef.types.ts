// src/types/chef.types.ts
export interface Chef {
  id: string;
  name: string;
  cuisine: string;
  bio: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  imageUrl: string;
  certifications: Certification[];
  serviceAreas: string[];
}

export interface Certification {
  title: string;
  organization: string;
}