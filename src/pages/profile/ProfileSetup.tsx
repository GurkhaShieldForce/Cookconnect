// src/pages/profile/ProfileSetup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/auth/authService';

export default function ProfileSetup() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState<'customer' | 'chef'>('customer');
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        location: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.createUserProfile({
                ...formData,
                userType,
            });

            // Redirect based on user type
            navigate(userType === 'chef' ? '/chef/dashboard' : '/customer/dashboard');
        } catch (error) {
            console.error('Profile setup failed:', error);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-6 py-12">
            <h1 className="mb-8 text-3xl font-bold text-center">Complete Your Profile</h1>
            <div className="rounded-xl bg-white p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-6">
                        <label className="mb-2 block text-lg font-medium">I want to...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setUserType('customer')}
                                className={`p-4 rounded-lg border-2 ${
                                    userType === 'customer' ? 'border-orange-600' : 'border-gray-200'
                                }`}
                            >
                                Order Food
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('chef')}
                                className={`p-4 rounded-lg border-2 ${
                                    userType === 'chef' ? 'border-orange-600' : 'border-gray-200'
                                }`}
                            >
                                Cook & Sell Food
                            </button>
                        </div>
                    </div>

                    {/* Profile form fields */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full rounded-lg border p-3"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full rounded-lg border p-3"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full rounded-lg border p-3"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-full bg-orange-600 py-3 text-white hover:bg-orange-700"
                    >
                        Complete Setup
                    </button>
                </form>
            </div>
        </div>
    );
}