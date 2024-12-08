// src/components/chef/ChefCard.tsx
import { Star, Clock, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

interface ChefCardProps {
  name: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
  location: string;
  availability: string;
  onViewProfile: () => void;
}

export function ChefCard({
  name,
  specialties,
  rating,
  reviewCount,
  imageUrl,
  location,
  availability,
  onViewProfile
}: ChefCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="flex gap-6">
        <img
          src={imageUrl}
          alt={name}
          className="h-32 w-32 rounded-lg object-cover"
        />
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-gray-600">({reviewCount} reviews)</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {specialties.map(specialty => (
              <span
                key={specialty}
                className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800"
              >
                {specialty}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{availability}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onViewProfile}>
          View Profile
        </Button>
      </div>
    </div>
  );
}