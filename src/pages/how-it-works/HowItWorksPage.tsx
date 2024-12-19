// src/pages/how-it-works/HowItWorksPage.tsx
import MainLayout from '../../layouts/MainLayout';
import { ChefHat, Calendar, CreditCard, Utensils } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800">How HomeCook Connect Works</h1>
          <p className="mt-4 text-xl text-gray-600">Your journey to authentic culinary experiences</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <ChefHat className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Find Your Chef</h3>
            <p className="text-gray-600">Browse profiles of verified local chefs specializing in various cuisines</p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Schedule Service</h3>
            <p className="text-gray-600">Choose your preferred date and time for the culinary experience</p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure Booking</h3>
            <p className="text-gray-600">Book your chef with our secure payment system</p>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Utensils className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Enjoy</h3>
            <p className="text-gray-600">Experience authentic cuisine prepared just for you</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}