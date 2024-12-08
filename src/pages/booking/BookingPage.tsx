// src/pages/booking/BookingPage.tsx
import { useState } from 'react';
import { ChefHat, DollarSign } from 'lucide-react';
import { BookingForm } from '../../components/booking/BookingForm';
import MainLayout  from '../../layouts/MainLayout';

interface ServiceType {
  id: string;
  title: string;
  price: number;
  description: string;
}

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string>('');

  const services: ServiceType[] = [
    {
      id: 'private-dinner',
      title: 'Private Dinner Experience',
      price: 250,
      description: 'A personalized dining experience in your home'
    },
    {
      id: 'cooking-class',
      title: 'Interactive Cooking Class',
      price: 200,
      description: 'Learn authentic techniques and recipes'
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Complete Your Booking</h1>
              <p className="text-lg text-gray-600">Chef Maria Santos - Mediterranean Cuisine</p>
            </div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Select Your Experience</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedService === service.id
                        ? 'border-orange-600'
                        : 'border-orange-100 hover:border-orange-300'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-orange-600" />
                        <h3 className="font-medium">{service.title}</h3>
                      </div>
                      <span className="text-orange-600">${service.price}</span>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedService && (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <BookingForm
                  chefId="chef-123"
                  onSubmit={(data) => {
                    console.log('Booking submitted:', data);
                    // Handle booking submission
                  }}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Booking Summary</h2>
              {selectedService && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">
                      ${services.find(s => s.id === selectedService)?.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">$25</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-orange-600">
                      ${(services.find(s => s.id === selectedService)?.price || 0) + 25}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}