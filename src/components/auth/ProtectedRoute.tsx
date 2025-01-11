// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiresAuth?: boolean;
}

export function ProtectedRoute({ 
    children, 
    requiresAuth = true 
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useUser();
    const location = useLocation();

    if (requiresAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}