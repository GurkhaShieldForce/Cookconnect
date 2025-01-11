// src/pages/PrivacyPolicy.tsx
import MainLayout from '../layouts/MainLayout';

export default function PrivacyPolicy() {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-12">
          {/* ... other privacy policy content ... */}
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Deletion</h2>
            <p>
              Users can request deletion of their personal data by:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Visiting our <a href="/user-data-deletion" className="text-orange-600">Data Deletion Page</a></li>
              <li>Emailing our support team at support@homecookconnect.com</li>
              <li>Using the Facebook App Settings if you connected via Facebook</li>
            </ul>
            <p className="mt-4">
              Data deletion requests are processed within 30 days. You will receive
              confirmation once your data has been deleted.
            </p>
          </section>
        </div>
      </MainLayout>
    );
  }