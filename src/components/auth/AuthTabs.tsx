// src/components/auth/AuthTabs.tsx
import { useCallback } from 'react';

interface AuthTabsProps {
  activeTab: 'customer' | 'chef';
  onTabChange: (tab: 'customer' | 'chef') => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  const handleTabChange = useCallback((tab: 'customer' | 'chef') => {
    onTabChange(tab);
  }, [onTabChange]);

  return (
    <div className="mb-8 flex rounded-lg bg-gray-100 p-1">
      {['customer', 'chef'].map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabChange(tab as 'customer' | 'chef')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
            activeTab === tab 
              ? 'bg-white shadow-sm text-orange-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab === 'customer' ? 'Customer' : 'Professional Chef'}
        </button>
      ))}
    </div>
  );
}