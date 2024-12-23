// src/components/auth/AuthTabs.tsx
import React from 'react';

interface AuthTabsProps {
  activeTab: 'customer' | 'chef';
  onTabChange: (tab: 'customer' | 'chef') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  const handleTabChange = (tab: 'customer' | 'chef') => {
    onTabChange(tab);
  };

  return (
    <div className="auth-tabs">
      <button
        className={`tab ${activeTab === 'customer' ? 'active' : ''}`}
        onClick={() => handleTabChange('customer')}
      >
        Customer
      </button>
      <button
        className={`tab ${activeTab === 'chef' ? 'active' : ''}`}
        onClick={() => handleTabChange('chef')}
      >
        Chef
      </button>
    </div>
  );
};

export default AuthTabs;