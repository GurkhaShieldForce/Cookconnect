import React, { useState } from 'react';
import { Input } from '../common/Input';
import { SignupFormData } from '../../types/auth.types';

interface RegisterFormProps {
  userType: 'customer' | 'chef';
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function RegisterForm({ userType, onSubmit, isLoading = false }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    bio: '',
    specialties: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (userType === 'chef' && !formData.specialties) {
      newErrors.specialties = 'Specialties are required for chefs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const signupData: SignupFormData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
          specialties: formData.specialties
        }
      };

      await onSubmit(signupData);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
        required
      />

      <Input
        label="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        error={errors.firstName}
        required
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        error={errors.lastName}
        required
      />

      <Input
        label="Bio"
        type="textarea"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        error={errors.bio}
      />

      {userType === 'chef' && (
        <Input
          label="Specialties"
          value={formData.specialties}
          onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
          error={errors.specialties}
          placeholder="Enter your culinary specialties"
          required
        />
      )}

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-orange-600 py-3 text-white shadow-lg transition-all hover:bg-orange-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}