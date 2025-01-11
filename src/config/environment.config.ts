// src/config/environment.config.ts
const isProd = import.meta.env.PROD;

export const environmentConfig = {
    baseUrl: isProd ? 'http://0.0.0.0:80' : 'http://localhost:3001',
    apiUrl: isProd ? 'http://0.0.0.0:80' : 'http://localhost:3001',
    auth: {
        google: {
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirectUri: isProd ? 'http://0.0.0.0:80/auth/google/callback' : 'http://localhost:5173/auth/google/callback'
        },
        facebook: {
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            appSecret: import.meta.env.VITE_FACEBOOK_APP_SECRET,
            redirectUri: isProd 
                ? 'http://0.0.0.0:80/auth/facebook/callback' 
                : 'http://localhost:5173/auth/facebook/callback'
        }
    }
};