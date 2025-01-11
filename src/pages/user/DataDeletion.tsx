// src/pages/user/DataDeletion.tsx
import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useUser } from '../../contexts/UserContext';

export default function DataDeletion() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteRequest = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/user/data-deletion', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to process deletion request');
      
      setConfirmationStep(2);
    } catch (error) {
      setError('Failed to submit deletion request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Data Deletion Request</h1>
          
          {confirmationStep === 1 ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Request Data Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                You can request the deletion of all your personal data from HomeCook Connect.
                This process will:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Delete your account information</li>
                <li>Remove your profile data</li>
                <li>Delete your booking history</li>
                <li>Remove your reviews and ratings</li>
                <li>Disconnect Facebook and other social accounts</li>
              </ul>
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-orange-800">
                  ⚠️ This action cannot be undone. Once your data is deleted, it cannot be recovered.
                </p>
              </div>
              
              <button
                onClick={handleDeleteRequest}
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Request Data Deletion'}
              </button>
              
              {error && (
                <p className="text-red-600 mt-4">{error}</p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Request Submitted Successfully
              </h2>
              <p className="text-gray-600 mb-4">
                Your data deletion request has been received. We will process your request within 30 days.
                You will receive an email confirmation when the process is complete.
              </p>
              <p className="text-gray-600">
                For any questions about your deletion request, please contact our support team.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}