// src/utils/auth/authService.ts
import { environmentConfig } from '../../config/environment.config';
///import { FacebookAuthService } from './facebookAuth';
import type { User, AuthResponse, SignupFormData } from '../../types/auth.types';


// The AuthService class will handle all authentication-related logic

export interface GoogleAuthResponse {
    email: string;
    fullName: string;
    avatar?: string;
}

export interface ProfileUpdateData {
    fullName: string;
    phoneNumber: string;
    location: string;
    userType: 'customer' | 'chef';
}

export class AuthService {
    private readonly baseUrl: string;
    private authToken: string | null = null; // Add this line
    ///private facebookAuth: FacebookAuthService;

    constructor() {
        this.baseUrl = environmentConfig.apiUrl;
        this.authToken = localStorage.getItem('authToken');
        ///this.facebookAuth = new FacebookAuthService();
    }
    getBaseUrl(): string {
        return this.baseUrl;
    }

    async signupWithEmail(data: SignupFormData): Promise<AuthResponse> {
        try {
            // The data structure should already match our interface since TypeScript enforces it
            // We just need to ensure we're sending it correctly to the server
            const signupPayload = {
                email: data.email,
                password: data.password,
                userType: data.userType,
                // Only include profile if it exists
                profile: {
                    firstName: data.profile?.firstName,
                    lastName: data.profile?.lastName,
                    bio: data.profile?.bio || '',
                    specialties: data.profile?.specialties || ''
                }
            };
    
            console.log('Attempting signup with payload:', JSON.stringify(signupPayload, null, 2));
    
            const response = await fetch(`${this.baseUrl}/auth/signup`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(signupPayload)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error details:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });
                throw new Error(`Signup failed: ${errorText || response.statusText}`);
            }
    
            const result = await response.json();
            this.handleAuthSuccess(result);
            await this.login(data.email, data.password);
            return result;
        } catch (error) {
            console.error('Signup process failed:', {
                error,
                requestData: data
            });
            this.handleAuthError(error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Login failed: ${response.statusText}`);
            }
    
            const result = await response.json();
            
            if (!result.token) {
                throw new Error('Invalid authentication response: Missing token');
            }
    
            this.handleAuthSuccess(result);
            return result;
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    // OAuth Methods
    async initiateGoogleAuth(): Promise<void> {
        const state = this.generateStateParameter();
        const authUrl = this.buildGoogleAuthUrl(state);
        localStorage.setItem('oauth_state', state);

        const popup = this.openAuthWindow(authUrl, 'GoogleAuth');
        return this.handleAuthCallback(popup);
    }

    async initiateFacebookAuth(): Promise<void> {
        const FB_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
        const REDIRECT_URI = `${window.location.origin}/auth/facebook/callback`;
        
        const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=email,public_profile`;
        
        // Open the popup
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
    
        window.open(
            authUrl,
            'FacebookAuth',
            `width=${width},height=${height},left=${left},top=${top}`
        );
    }

    async updateProfile(profileData: ProfileUpdateData): Promise<void> {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Not authenticated');
            }
    
            const response = await fetch(`${this.baseUrl}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData),
            });
    
            if (!response.ok) {
                throw new Error('Profile update failed');
            }
    
            // Update the stored user data with the new profile information
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
    
            // If userType has changed, we should update any relevant state
            if (updatedUser.userType !== this.getCurrentUser()?.userType) {
                this.handleAuthSuccess({
                    user: updatedUser,
                    token: token
                });
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }
    // URL Building Methods
    private buildGoogleAuthUrl(state: string): string {
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        const params = {
            client_id: environmentConfig.auth.google.clientId,
            redirect_uri: environmentConfig.auth.google.redirectUri,
            response_type: 'code',
            scope: 'email profile',
            access_type: 'offline',
            state: state,
            prompt: 'select_account'
        };

        return this.buildAuthUrl(authUrl, params);
    }



    private buildAuthUrl(baseUrl: URL, params: Record<string, string>): string {
        Object.entries(params).forEach(([key, value]) => {
            baseUrl.searchParams.append(key, value);
        });
        return baseUrl.toString();
    }

    // Authentication Window Management
    private openAuthWindow(url: string, name: string): Window | null {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        return window.open(
            url,
            name,
            `width=${width},height=${height},left=${left},top=${top}`
        );
    }

    // Authentication Response Handling
    private handleAuthCallback(popup: Window | null): Promise<void> {
        return new Promise((resolve, reject) => {
            const messageHandler = (event: MessageEvent) => {
                if (event.origin !== this.baseUrl) return;

                if (event.data.type === 'AUTH_SUCCESS') {
                    const { code, state } = event.data;
                    
                    if (state !== localStorage.getItem('oauth_state')) {
                        this.cleanup(popup, messageHandler);
                        reject(new Error('Invalid state parameter'));
                        return;
                    }

                    this.handleAuthCode(code)
                        .then(() => {
                            resolve();
                            this.cleanup(popup, messageHandler);
                        })
                        .catch(error => {
                            reject(error);
                            this.cleanup(popup, messageHandler);
                        });
                }

                if (event.data.type === 'AUTH_ERROR') {
                    reject(new Error(event.data.error));
                    this.cleanup(popup, messageHandler);
                }
            };

            window.addEventListener('message', messageHandler);
        });
    }

    private async handleAuthCode(code: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) throw new Error('Auth code exchange failed');

            const authData = await response.json();
            this.handleAuthSuccess(authData);
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    // Authentication State Management
    private handleAuthSuccess(authData: AuthResponse): void {
        if (!authData.token) {
            throw new Error('No authentication token received');
        }
        
        this.authToken = authData.token;
        localStorage.setItem('authToken', authData.token);
        
        if (authData.user) {
            localStorage.setItem('user', JSON.stringify(authData.user));
        }
    }

    private handleAuthError(error: unknown): void {
        this.authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.error('Authentication error:', error);
    }

    // Utility Methods
    private cleanup(popup: Window | null, messageHandler: (event: MessageEvent) => void): void {
        window.removeEventListener('message', messageHandler);
        localStorage.removeItem('oauth_state');
        popup?.close();
    }

    private generateStateParameter(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // Public Utility Methods
    getAuthToken(): string | null {
    // First check the instance variable
    if (this.authToken) {
        return this.authToken;
    }

    // Then check localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        this.authToken = storedToken; // Update instance variable
        return storedToken;
    }

    return null;
}
    getCurrentUser(): User | null {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        
        try {
            const userData = JSON.parse(userString);
            // Ensure createdAt is converted to a Date object
            return {
                ...userData,
                createdAt: new Date(userData.createdAt)
            };
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify({
            ...user,
            createdAt: user.createdAt.toISOString() // Store date as ISO string
        }));
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
    

    logout(): void {
        this.authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.FB?.logout(); // Add this line
    }
}

export const authService = new AuthService();