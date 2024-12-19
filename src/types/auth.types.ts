// src/types/auth.types.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: 'customer' | 'chef';
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

  export interface AuthResponse {
    user: User;
    token: string;
}

export interface SignupFormData {
    email: string;
    password: string;
    fullName: string;
    userType: 'customer' | 'chef';
}
  
export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
}

export interface AuthWindow extends Window {
  googleAuthCallback?: (response: any) => void;
}
  
  
  export interface PaymentDetails {
    bookingId: string;
    amount: number;
    serviceFee: number;
    platformFee: number;
    status: 'pending' | 'processed' | 'failed';
    transactionId?: string;
  }
  
