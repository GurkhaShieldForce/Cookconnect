// src/layouts/AuthLayout.tsx
import { ReactNode } from 'react';
import { ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
      <div className="container mx-auto p-4">
        <Link to="/" className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-2xl font-bold text-transparent">
            HomeCook Connect
          </span>
        </Link>
      </div>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        {children}
      </div>
    </div>
  );
}