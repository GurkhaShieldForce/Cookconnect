// src/config/environment.config.ts
const isProd = import.meta.env.PROD;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const environmentConfig = {
    baseUrl: isProd ? apiUrl : 'http://localhost:3001',
    apiUrl: isProd ? apiUrl : 'http://localhost:3001',
    auth: {
        google: {
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirectUri: isProd 
                ? `${apiUrl}/auth/google/callback` 
                : 'http://localhost:5173/auth/google/callback'
        },
        facebook: {
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            appSecret: import.meta.env.VITE_FACEBOOK_APP_SECRET,
            redirectUri: isProd 
                ? `${apiUrl}/auth/facebook/callback` 
                : 'http://localhost:5173/auth/facebook/callback'
        }
    }
};