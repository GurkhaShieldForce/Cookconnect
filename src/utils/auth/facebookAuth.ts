// src/utils/auth/facebookAuth.ts
import { environmentConfig } from '../../config/environment.config';

export interface FacebookAuthResponse {
    accessToken: string;
    userID: string;
    email?: string;
    name?: string;
}

export class FacebookAuthService {
    private baseUrl = environmentConfig.baseUrl;

    async initiateFacebookAuth(): Promise<void> {
        // Load Facebook SDK
        await this.loadFacebookSDK();
        
        // Initialize Facebook SDK
        window.FB.init({
            appId: environmentConfig.auth.facebook.appId,
            cookie: true,
            xfbml: true,
            version: 'v21.0' // Use latest Facebook API version
        });

        // Trigger Facebook login
        return new Promise((resolve, reject) => {
            window.FB.login(
                (response: any) => {
                    if (response.authResponse) {
                        this.handleAuthSuccess(response.authResponse)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        reject(new Error('Facebook authentication failed'));
                    }
                },
                { scope: 'email,public_profile' }
            );
        });
    }

    private async loadFacebookSDK(): Promise<void> {
        return new Promise((resolve) => {
            // Add Facebook SDK script if not already present
            if (document.getElementById('facebook-jssdk')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = 'facebook-jssdk';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            script.async = true;
            script.defer = true;
            
            script.onload = () => resolve();
            document.body.appendChild(script);
        });
    }

    private async handleAuthSuccess(authResponse: any): Promise<void> {
        try {
            // Get user profile information
            const userInfo = await this.getFacebookUserInfo(authResponse.accessToken);

            // Send to our backend for authentication
            const response = await fetch(`${this.baseUrl}/auth/facebook/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: authResponse.accessToken,
                    userInfo
                })
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate with server');
            }

            const data = await response.json();
            
            // Store authentication data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Update user context if using React Context
            // userContext.setUser(data.user);
        } catch (error) {
            console.error('Facebook authentication error:', error);
            throw error;
        }
    }

    private async getFacebookUserInfo(accessToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            window.FB.api(
                '/me',
                { fields: 'email,name,picture', access_token: accessToken },
                (response: any) => { // Explicitly type the 'response' parameter
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response);
                    }
                }
            );
        });
    }
}

// Add Facebook SDK types
declare global {
    interface Window {
        FB: any;
    }
}