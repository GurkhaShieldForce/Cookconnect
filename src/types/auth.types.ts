// src/types/auth.types.ts
export interface User {
    id: string;
    email: string;
    fullName: string;
    type: 'customer' | 'chef';
    createdAt: Date;
  }
  
  export interface Chef extends User {
    businessName: string;
    specialties: string[];
    biography: string;
    location: string;
    rating: number;
    reviewCount: number;
    availability: {
      weekdays: boolean;
      weekends: boolean;
      evenings: boolean;
    };
    certifications: string[];
  }
  
  
  
  export interface PaymentDetails {
    bookingId: string;
    amount: number;
    serviceFee: number;
    platformFee: number;
    status: 'pending' | 'processed' | 'failed';
    transactionId?: string;
  }
  
