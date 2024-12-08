
// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { Mail, Lock, User, ChefHat } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface RegisterFormProps {
  userType: 'customer' | 'chef';
}

export function RegisterForm({ userType }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement registration logic
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {userType === 'chef' && (
          <Input
            label="Business Name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            icon={<ChefHat className="h-5 w-5" />}
            required
          />
        )}
        <Input
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          icon={<User className="h-5 w-5" />}
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail className="h-5 w-5" />}
          required
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          icon={<Lock className="h-5 w-5" />}
          required
        />
        <Button type="submit" variant="primary" fullWidth>
          Create Account
        </Button>
      </form>
    </div>
  );
}

// src/components/auth/AuthTabs.tsx
interface AuthTabsProps {
  activeTab: 'customer' | 'chef';
  onTabChange: (tab: 'customer' | 'chef') => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="mb-8 flex rounded-lg bg-gray-100 p-1">
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