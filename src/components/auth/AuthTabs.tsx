// src/components/auth/AuthTabs.tsx
interface AuthTabsProps {
    activeTab: 'customer' | 'chef';
    onTabChange: (tab: 'customer' | 'chef') => void;
  }
  
  export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
    return (
      <div className="mb-8 flex rounded-lg bg-gray-100 p-1 max-w-md mx-auto">
        <button
          onClick={() => onTabChange('customer')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
            activeTab === 'customer' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => onTabChange('chef')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
            activeTab === 'chef' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600'
          }`}
        >
          Professional Chef
        </button>
      </div>
    );
  }