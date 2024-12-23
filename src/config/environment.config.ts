// src/config/environment.config.ts
const isProd = import.meta.env.PROD;

export const environmentConfig = {
    baseUrl: isProd ? 'http://0.0.0.0:80' : '',
    apiUrl: isProd ? 'http://0.0.0.0:80/api' : '/api',
    auth: {
        google: {
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirectUri: isProd ? 'http://0.0.0.0:80/auth/google/callback' : 'http://localhost:5173/auth/google/callback'
        },
        github: {
            clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
            redirectUri: isProd ? 'http://0.0.0.0:80/auth/github/callback' : 'http://localhost:5173/auth/github/callback'
        }
    }
};