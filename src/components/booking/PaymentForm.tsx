// src/components/booking/PaymentForm.tsx
import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PaymentFormData } from '../../types/booking.types';

interface PaymentFormProps {
  amount: number;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  loading: boolean;
}

export function PaymentForm({ amount, onSubmit, loading }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Card Number"
        value={formData.cardNumber}
        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
        icon={<CreditCard className="h-5 w-5" />}
        required
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Expiry Date"
          placeholder="MM/YY"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          required
        />
        <Input
          label="Security Code"
          placeholder="CVV"
          type="password"
          value={formData.cvv}
          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
          icon={<Lock className="h-5 w-5" />}
          required
        />
      </div>

      <Input
        label="Cardholder Name"
        value={formData.cardholderName}
        onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
        required
      />

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? 'Processing...' : `Pay $${amount}`}
      </Button>
    </form>
  );
}