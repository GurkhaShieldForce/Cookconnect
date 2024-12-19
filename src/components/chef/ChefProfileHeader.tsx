// src/components/chef/ChefProfileHeader.tsx
import { Star, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../common/Button';
import { Chef } from '../../types/chef.types';

interface ChefProfileHeaderProps {
  chef: Chef;
  onBook: () => void;
}

export function ChefProfileHeader({ chef, onBook }: ChefProfileHeaderProps) {
  return (
    <div className="mb-8 grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="flex gap-6">
            <img
              src={chef.imageUrl || "/api/placeholder/150/150"}
              alt={chef.name}
              className="h-36 w-36 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{chef.name}</h1>
              <p className="text-lg text-gray-600">{chef.cuisine}</p>
              <div className="mt-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{chef.rating}</span>
                <span className="text-gray-600">({chef.reviews} reviews)</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{chef.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <Button variant="primary" fullWidth onClick={onBook}>
          Book Now
        </Button>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-5 w-5" />
            <span>Contact Available After Booking</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-5 w-5" />
            <span>Message Chef</span>
          </div>
        </div>
      </div>
    </div>
  );
}