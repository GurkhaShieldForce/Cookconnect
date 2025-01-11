import React from 'react';

interface AuthTabsProps {
 activeTab: 'customer' | 'chef';
 onTabChange: (tab: 'customer' | 'chef') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
 return (
   <div className="flex w-full rounded-lg bg-gray-100 p-1">
     <button
       className={`flex-1 rounded-md py-2 text-sm font-medium transition-all
         ${activeTab === 'customer' 
           ? 'bg-white text-gray-900 shadow-sm' 
           : 'text-gray-500 hover:text-gray-700'}`}
       onClick={() => onTabChange('customer')}
     >
       Customer
     </button>
     <button  
       className={`flex-1 rounded-md py-2 text-sm font-medium transition-all
         ${activeTab === 'chef'
           ? 'bg-white text-gray-900 shadow-sm'
           : 'text-gray-500 hover:text-gray-700'}`}
       onClick={() => onTabChange('chef')}
     >
       Chef
     </button>
   </div>
 );
};

export default AuthTabs;