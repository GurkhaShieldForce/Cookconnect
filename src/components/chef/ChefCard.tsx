// src/components/chef/ChefCard.tsx
import { Star, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

interface ChefCardProps {
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  imageUrl: string;
  onViewProfile: () => void;
}

export function ChefCard({
  name,
  cuisine,
  rating,
  reviews,
  location,
  specialties,
  imageUrl,
  onViewProfile
}: ChefCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="flex gap-4">
        <img
          src={imageUrl}
          alt={name}
          className="h-24 w-24 rounded-lg object-cover"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{cuisine}</p>
          <div className="mt-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {rating} ({reviews} reviews)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-600">{location}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {specialties.slice(0, 2).map(specialty => (
          <span
            key={specialty}
            className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-800"
          >
            {specialty}
          </span>
        ))}
      </div>
      <Button variant="primary" fullWidth className="mt-4" onClick={onViewProfile}>
        View Profile
      </Button>
    </div>
  );
}