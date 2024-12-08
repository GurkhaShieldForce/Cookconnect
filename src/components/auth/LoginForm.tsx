// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5" />}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-5 w-5" />}
          required
        />
        <Button type="submit" variant="primary" fullWidth>
          Sign In
        </Button>
      </form>
    </div>
  );
}