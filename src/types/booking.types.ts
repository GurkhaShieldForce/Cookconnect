// src/types/booking.types.ts
export interface Booking {
    id: string;
    chefId: string;
    customerId: string;
    serviceType: 'private_dinner' | 'cooking_class';
    date: Date;
    time: string;
    guestCount: number;
    location: string;
    specialRequests?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalAmount: number;
  }