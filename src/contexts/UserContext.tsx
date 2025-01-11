// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User } from '../types/auth.types';
import { authService } from '../utils/auth/authService';
import { useInactivityTimer } from '../hooks/useInactivityTimer';


interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for existing authentication on mount
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
            // Convert the createdAt string back to a Date object
            const userWithDate = {
                ...savedUser,
                createdAt: new Date(savedUser.createdAt)
            };
            setUser(userWithDate);
            setIsAuthenticated(true);
        }
    }, []);

    const updateUser = (newUser: User | null) => {
        if (newUser) {
            // Ensure createdAt is a Date object when updating user
            const userWithDate = {
                ...newUser,
                createdAt: newUser.createdAt instanceof Date 
                    ? newUser.createdAt 
                    : new Date(newUser.createdAt)
            };
            setUser(userWithDate);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const handleInactivity = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Optionally redirect to login page
        window.location.href = '/login';
      }, []);
      useInactivityTimer(handleInactivity, 30);

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser: updateUser,
            isAuthenticated 
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}