// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SignupFormData } from '../../types/auth.types';

interface RegisterFormProps {
  userType: 'customer' | 'chef';
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({ userType, onSubmit, isLoading = false }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        userType,
      });
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        icon={<User className="h-5 w-5" />}
        error={errors.fullName}
        required
      />

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={<Mail className="h-5 w-5" />}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        icon={<Lock className="h-5 w-5" />}
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        icon={<Lock className="h-5 w-5" />}
        error={errors.confirmPassword}
        required
      />

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}