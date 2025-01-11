// src/components/booking/BookingForm.tsx
import { useState } from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface BookingFormProps {
  chefId: string;
  menuId: string;
  onSubmit: (data: BookingFormData) => void;
}

interface BookingFormData {
  date: string;
  time: string;
  guestCount: string;
  location: string;
  specialRequests: string;
  chefId: string;
  menuId: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ chefId, menuId, onSubmit }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '',
    guestCount: '',
    location: '',
    specialRequests: '',
    chefId,
    menuId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, chefId, menuId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          icon={<Calendar className="h-5 w-5" />}
          required
        />
        <Input
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          icon={<Clock className="h-5 w-5" />}
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Number of Guests"
          type="number"
          value={formData.guestCount}
          onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
          icon={<Users className="h-5 w-5" />}
          required
        />
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          icon={<MapPin className="h-5 w-5" />}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Special Requests
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          className="w-full rounded-lg border p-3"
          rows={4}
          placeholder="Dietary restrictions, preferences, or special occasions..."
        />
      </div>

      <Button type="submit" variant="primary" fullWidth>
        Continue to Payment
      </Button>
    </form>
  );
};