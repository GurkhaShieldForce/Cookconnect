import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const code = params.get('code');
                const state = params.get('state');

                console.log('Received callback with:', { code: code?.substring(0, 10), state: state?.substring(0, 10) });

                if (!code) {
                    throw new Error('Authorization code not found');
                }

                // Exchange the authorization code for an access token
                const response = await fetch('/api/auth/google/callback', {
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

                // Save the token (e.g., in localStorage or context)
                localStorage.setItem('authToken', data.token);

                // Navigate to the appropriate page after successful login
                navigate('/dashboard');
            } catch (error) {
                console.error('Google callback handling failed:', error);
                // Handle the error, e.g., show an error message, navigate to an error page, etc.
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, navigate]);

    return <div>Loading...</div>;
}