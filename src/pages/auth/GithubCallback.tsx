// src/pages/auth/GithubCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GithubCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const code = params.get('code');
                const state = params.get('state');

                console.log('Received callback with:', { code: code?.substring(0, 10), state: state?.substring(0, 10) });

                if (!code || !state) {
                    console.error('Missing authentication parameters');
                    navigate('/login');
                    return;
                }

                // Send code back to opener window
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'GITHUB_AUTH_SUCCESS',
                        code,
                        state
                    }, window.location.origin);
                    
                    // Add the dashboard redirect here
                    window.opener.location.href = '/dashboard';
                    window.close();
                } else {
                    console.log('No opener window found');
                    navigate('/dashboard');  // Changed from navigate('/')
                }

            } catch (error) {
                console.error('Authentication failed:', error);
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'GITHUB_AUTH_ERROR',
                        error: 'Authentication failed'
                    }, window.location.origin);
                    window.close();
                } else {
                    navigate('/login');
                }
            }
        };

        handleCallback();
    }, [navigate, location]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Completing GitHub authentication...</h2>
                <p className="text-gray-600">Please wait while we process your sign-in.</p>
            </div>
        </div>
    );
}