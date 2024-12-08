// src/components/chef/ChefProfile.tsx
import { Star, Award, MapPin, Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface ChefProfileProps {
  chef: {
    name: string;
    specialty: string;
    bio: string;
    experience: number;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    location: string;
    availability: string;
    certifications: string[];
    specialties: string[];
  };
  onBookNow: () => void;
}

export function ChefProfile({ chef, onBookNow }: ChefProfileProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-wrap gap-8">
          <img
            src={chef.imageUrl}
            alt={chef.name}
            className="h-48 w-48 rounded-xl object-cover shadow-lg"
          />
          <div className="flex-grow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{chef.name}</h1>
                <p className="text-lg text-gray-600">{chef.specialty}</p>
              </div>
              <Button variant="primary" onClick={onBookNow}>
                Book Now
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{chef.rating}</span>
                <span className="text-gray-600">({chef.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{chef.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{chef.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">About</h2>
            <p className="text-gray-600">{chef.bio}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Specialties</h2>
            <div className="flex flex-wrap gap-3">
              {chef.specialties.map(specialty => (
                <span
                  key={specialty}
                  className="rounded-full bg-orange-100 px-4 py-2 text-orange-800"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Credentials</h2>
            <div className="space-y-4">
              {chef.certifications.map(certification => (
                <div key={certification} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-600">{certification}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}