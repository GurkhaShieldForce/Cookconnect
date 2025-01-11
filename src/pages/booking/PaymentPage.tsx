// src/pages/booking/PaymentPage.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, Users, Clock, ChefHat } from 'lucide-react';
import { PaymentForm } from '../../components/booking/PaymentForm';
import MainLayout from '../../layouts/MainLayout';
import { PaymentFormData } from '../../types/booking.types';

interface BookingDetails {
  date: string;
  time: string;
  guests: number;
  menuName: string;
  pricePerPerson: number;
  serviceFee: number;
  chefName: string;
  specialRequests?: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.bookingDetails) {
      navigate('/booking');
    }
  }, [state, navigate]);

  const bookingDetails = state?.bookingDetails as BookingDetails;
  const totalAmount = bookingDetails ? 
    (bookingDetails.pricePerPerson * bookingDetails.guests) + bookingDetails.serviceFee : 0;

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Future Stripe integration will go here
      console.log('Processing payment:', paymentData);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page (to be implemented)
      // navigate('/booking/success');
      
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Return to Booking Details
        </button>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Complete Your Payment</h1>
              <p className="text-lg text-gray-600">
                Book your private chef experience with {bookingDetails.chefName}
              </p>
            </div>

            <div className="mb-8 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-blue-800">
              <Shield className="h-5 w-5" />
              <p>Your payment information is encrypted and secure</p>
            </div>

            {error && (
              <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <PaymentForm
                amount={totalAmount}
                onSubmit={handlePaymentSubmit}
                loading={loading}
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="rounded-lg bg-orange-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-orange-800">
                      <ChefHat className="h-5 w-5" />
                      <span className="font-medium">{bookingDetails.menuName}</span>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{bookingDetails.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{bookingDetails.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{bookingDetails.guests} guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per person</span>
                      <span>${bookingDetails.pricePerPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests</span>
                      <span>× {bookingDetails.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span>${bookingDetails.serviceFee}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-orange-600">
                        ${totalAmount}
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