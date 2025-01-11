// src/pages/auth/FacebookCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../utils/auth/authService';

export default function FacebookCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const code = params.get('code');
                const state = params.get('state');

                console.log('Received Facebook callback with:', { 
                    code: code?.substring(0, 10), 
                    state: state?.substring(0, 10) 
                });

                if (!code) {
                    throw new Error('Authorization code not found');
                }

                // Exchange the authorization code for an access token
                const response = await fetch('/api/auth/facebook/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to exchange authorization code:', errorData);
                    throw new Error('Failed to exchange authorization code');
                }

                const data = await response.json();
                console.log('Token received:', data.token);

                // Save the token
                localStorage.setItem('authToken', data.token);

                // Navigate to the appropriate dashboard
                const user = await authService.getCurrentUser();
                if (user?.userType === 'chef') {
                    navigate('/chef/dashboard');
                } else {
                    navigate('/customer/dashboard');
                }
            } catch (error) {
                console.error('Facebook callback handling failed:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Completing Facebook Authentication...</h2>
                <p className="text-gray-600">Please wait while we process your sign-in.</p>
            </div>
        </div>
    );
}