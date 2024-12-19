// src/utils/auth/authService.ts
import { AuthResponse, SignupFormData, User, GoogleAuthResponse, UserProfile } from './types';
import { GoogleAuthService } from './googleAuth';
import { environmentConfig } from '../../config/environment.config';

export class AuthService {
    private baseUrl = environmentConfig.baseUrl;  // Add this line
    private authToken: string | null = null;
    private googleAuth: GoogleAuthService;

    constructor() {
        this.googleAuth = new GoogleAuthService();
    }
    private generateStateParameter(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }
    
    private async handleGithubAuthCode(code: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/github/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error('GitHub authorization code exchange failed');
            }

            const authData = await response.json();
            this.handleAuthSuccess(authData);
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }
    async signupWithEmail(data: SignupFormData): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Signup failed');

            const result = await response.json();
            this.handleAuthSuccess(result);
            return result;
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('Login failed');

            const result = await response.json();
            this.handleAuthSuccess(result);
            return result;
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }

    async initiateGoogleAuth(): Promise<void> {
        return this.googleAuth.initiateAuth();
    }

    async handleGoogleAuthSuccess(authData: GoogleAuthResponse): Promise<void> {
        console.log('Starting Google Authentication Completion Process')
        try {
            console.log('Processing authentication for email:', authData.email);

            const response = await fetch(`${this.baseUrl}/auth/google/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData),
            });

            if (!response.ok) {
                throw new Error('Failed to complete Google authentication');
            }

            const result = await response.json();
            this.handleAuthSuccess(result);

            if (result.isNewUser) {
                await this.createUserProfile({
                    email: authData.email,
                    fullName: authData.fullName,
                    userType: 'customer',
                    avatar: authData.avatar
                });
            }
        } catch (error) {
            this.handleAuthError(error);
            throw error;
        }
    }
    
    // src/utils/auth/authService.ts
    async initiateGithubAuth(): Promise<void> {
        const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
        
        const params = {
            client_id: environmentConfig.auth.github.clientId,
            redirect_uri: environmentConfig.auth.github.redirectUri,
            scope: 'user:email',
            state: this.generateStateParameter(),
        };

        githubAuthUrl.search = new URLSearchParams(params).toString();
        localStorage.setItem('oauth_state', params.state);

        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            githubAuthUrl.toString(),
            'GitHubAuth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        return new Promise((resolve, reject) => {
            const messageHandler = (event: MessageEvent) => {
                if (event.origin !== this.baseUrl) return;

                if (event.data.type === 'GITHUB_AUTH_SUCCESS') {
                    const { code, state } = event.data;
                    
                    if (state !== localStorage.getItem('oauth_state')) {
                        reject(new Error('Invalid state parameter'));
                        return;
                    }

                    this.handleGithubAuthCode(code)
                        .then(resolve)
                        .catch(reject)
                        .finally(() => {
                            window.removeEventListener('message', messageHandler);
                            localStorage.removeItem('oauth_state');
                            popup?.close();
                        });
                }

                if (event.data.type === 'GITHUB_AUTH_ERROR') {
                    reject(new Error(event.data.error));
                    window.removeEventListener('message', messageHandler);
                    localStorage.removeItem('oauth_state');
                    popup?.close();
                }
            };

            window.addEventListener('message', messageHandler);
        });
    }
        async createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
            try {
                const token = this.getAuthToken();
                if (!token) throw new Error('Not authenticated');
        
                const response = await fetch(`${this.baseUrl}/user/profile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profileData),
                });
        
                if (!response.ok) throw new Error('Failed to create profile');
        
                return response.json();
            } catch (error) {
                console.error('Profile creation failed:', error);
                throw error;
            }
        }
        private handleAuthSuccess(authData: AuthResponse): void {
            this.authToken = authData.token;
            localStorage.setItem('authToken', authData.token);
            localStorage.setItem('user', JSON.stringify(authData.user));
        }

        private handleAuthError(error: unknown): void {
            this.authToken = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            console.error('Authentication error:', error);
        }

        getAuthToken(): string | null {
            return this.authToken || localStorage.getItem('authToken');
        }
        

        getCurrentUser(): User | null {
            const userString = localStorage.getItem('user');
            return userString ? JSON.parse(userString) : null;
        }

        isAuthenticated(): boolean {
            return !!this.getAuthToken();
        }

        logout(): void {
            this.authToken = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
        async getUserProfile(): Promise<UserProfile | null> {
            try {
                const token = this.getAuthToken();
                if (!token) return null;
        
                const response = await fetch(`${this.baseUrl}/user/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
        
                return await response.json();
            } catch (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }
        }
}

export const authService = new AuthService();