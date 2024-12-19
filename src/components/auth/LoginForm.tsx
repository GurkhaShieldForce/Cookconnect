// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
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
            await onSubmit(formData);
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Login failed'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
                <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>

                <a href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                    Forgot password?
                </a>
            </div>

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
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>
    );
}