// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';
import { Navigation } from '../components/common/Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
      <Navigation />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}