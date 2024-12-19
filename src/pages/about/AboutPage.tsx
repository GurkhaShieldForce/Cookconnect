// src/pages/about/AboutPage.tsx
import MainLayout from '../../layouts/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800">About HomeCook Connect</h1>
          <p className="mt-4 text-xl text-gray-600">Connecting food lovers with authentic culinary experiences</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
              <p className="mt-2 text-gray-600">
                HomeCook Connect bridges the gap between talented home chefs and food enthusiasts seeking authentic culinary experiences. We believe in preserving cultural traditions through food while creating economic opportunities for skilled cooks.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Our Values</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Authenticity</h3>
                  <p className="text-gray-600">We celebrate genuine cultural culinary traditions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Community</h3>
                  <p className="text-gray-600">Building connections through shared food experiences.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Quality</h3>
                  <p className="text-gray-600">Ensuring high standards in every culinary experience.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Why Choose Us</h2>
            <div className="space-y-6">
              <div className="rounded-lg bg-orange-50 p-4">
                <h3 className="font-medium text-orange-800">Verified Chefs</h3>
                <p className="text-gray-600">All our chefs undergo thorough verification and quality checks.</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <h3 className="font-medium text-orange-800">Secure Platform</h3>
                <p className="text-gray-600">Safe and secure booking and payment system.</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <h3 className="font-medium text-orange-800">Cultural Authenticity</h3>
                <p className="text-gray-600">Experience genuine traditional cooking methods and recipes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}