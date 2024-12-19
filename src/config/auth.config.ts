// src/config/auth.config.ts
export const authConfig = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    }
};