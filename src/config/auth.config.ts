// src/config/auth.config.ts
export const authConfig = {
    
    google: {
        clientId: import.meta.env.GOOGLE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        redirectUri: import.meta.env.GOOGLE_REDIRECT_URI,
    },
    github: {
        clientId: import.meta.env.GITHUB_CLIENT_ID,
        clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
    }
};