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

// Add these new interfaces for form handling
export interface BookingFormData {
  date: string;
  time: string;
  guestCount: string;
  location: string;
  specialRequests?: string;
  customerName: string;
  email: string;
  phone: string;
  paymentMethod: any; // or use proper Stripe PaymentMethod type if available
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentDetails {
  bookingId: string;
  amount: number;
  serviceFee: number;
  platformFee: number;
  status: 'pending' | 'processed' | 'failed';
  transactionId?: string;
}