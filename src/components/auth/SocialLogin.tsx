// src/components/auth/SocialLogin.tsx
import { useState } from 'react';
import { Facebook, LogIn } from 'lucide-react';
import { Button } from '../common/Button';
import { authService } from '../../utils/auth/authService';
import { useNavigate } from 'react-router-dom';

export function SocialLogin() {
    const [isLoading, setIsLoading] = useState<'google' |  'facebook' | null>(null);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            setIsLoading('google');
            await authService.initiateGoogleAuth();
            const user = authService.getCurrentUser();
            navigate(user?.userType === 'chef' ? '/chef/onboarding' : '/dashboard');
        } catch (error) {
            console.error('Google login failed:', error);
        } finally {
            setIsLoading(null);
        }
    };
    const handleFacebookLogin = async () => {
        try {
            setIsLoading('facebook');
            await authService.initiateFacebookAuth();
            const user = authService.getCurrentUser();
            // Navigate based on user type after successful login
            if (user) {
                navigate(user.userType === 'chef' ? '/chef/dashboard' : '/customer/dashboard');
            }
        } catch (error) {
            console.error('Facebook login failed:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsLoading(null);
        }
    };

    

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={isLoading === 'google'}
                >
                    <div className="flex items-center justify-center gap-2">
                        <LogIn className="h-5 w-5" />
                        <span>{isLoading === 'google' ? 'Connecting...' : 'Google'}</span>
                    </div>
                </Button>

                <Button
                    variant="outline"
                    onClick={handleFacebookLogin}
                    disabled={isLoading === 'facebook'}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Facebook className="h-5 w-5" />
                        <span>
                            {isLoading === 'facebook' ? 'Connecting...' : 'Facebook'}
                        </span>
                    </div>
                </Button>
                
            </div>
        </div>
    );
}