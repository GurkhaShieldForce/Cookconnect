// src/pages/booking/PaymentPage.tsx
import { useEffect, useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { PaymentForm } from '../../components/booking/PaymentForm';
import MainLayout  from '../../layouts/MainLayout';
import { PaymentFormData } from '../../types/booking.types';


interface BookingSummary {
  service: string;
  date: string;
  time: string;
  guests: number;
  serviceFee: number;
  platformFee: number;
}

export default function PaymentPage() {
  const [bookingSummary] = useState<BookingSummary>({
    service: 'Private Dinner Experience',
    date: 'December 15, 2024',
    time: '7:00 PM',
    guests: 4,
    serviceFee: 250,
    platformFee: 25
  });

  useEffect(() => {
    // In a real implementation, we would fetch the booking details
    // from the previous step or from the server
  }, []);

  const handlePaymentSubmit = (paymentData: PaymentFormData) => {
    console.log('Processing payment:', paymentData);
    // Handle payment processing and booking confirmation
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <button className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-5 w-5" />
          Return to Booking Details
        </button>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Complete Your Payment</h1>
              <p className="text-lg text-gray-600">Secure payment processing for your booking</p>
            </div>

            <div className="mb-8 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-blue-800">
              <Shield className="h-5 w-5" />
              <p>Your payment information is encrypted and secure</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <PaymentForm
                amount={bookingSummary.serviceFee + bookingSummary.platformFee}
                onSubmit={handlePaymentSubmit}
              />
              <p className="mt-4 text-center text-sm text-gray-500">
                By completing this payment, you agree to our terms of service and cancellation policy.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="rounded-lg bg-orange-50 p-4 text-orange-800">
                    <p className="font-medium">{bookingSummary.service}</p>
                    <p className="text-sm">
                      {bookingSummary.date} • {bookingSummary.time}
                    </p>
                    <p className="text-sm">{bookingSummary.guests} guests</p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span>${bookingSummary.serviceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee</span>
                      <span>${bookingSummary.platformFee}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-orange-600">
                        ${bookingSummary.serviceFee + bookingSummary.platformFee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}