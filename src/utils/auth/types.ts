export interface User {
    id: string;
    email: string;
    fullName: string;
    userType: 'customer' | 'chef';
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

export interface GoogleAuthResponse {
    email: string;
    fullName: string;
    googleId: string;
    avatar?: string;
}

export interface UserProfile {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    userType: 'customer' | 'chef';
    location?: string;  // Add this
    avatar?: string;
    preferences?: {
        cuisinePreferences?: string[];
        dietaryRestrictions?: string[];
        spiceLevel?: 'mild' | 'medium' | 'hot';
    };
    // Additional chef-specific fields
    specialties?: string[];
    yearsOfExperience?: number;
    certifications?: Array<{
        name: string;
        issuingAuthority: string;
        expiryDate: string;
    }>;
    availability?: {
        workingHours?: string;
        advanceNotice?: string;
    };
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}