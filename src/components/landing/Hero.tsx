// src/components/landing/Hero.tsx
import { useState, useEffect } from 'react';
import { Search, Globe2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

const cuisineTypes = [
  "Indian & Himalayan",
  "Italian",
  "French",
  "Japanese",
  "Mediterranean",
  "Thai",
  "Mexican",
  "Chinese",
  "Middle Eastern",
  "Spanish"
];

export function Hero() {
  const [currentCuisine, setCurrentCuisine] = useState(cuisineTypes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCuisine(prevCuisine => {
        const currentIndex = cuisineTypes.indexOf(prevCuisine);
        return cuisineTypes[(currentIndex + 1) % cuisineTypes.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden pb-32 pt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-50/50" />
      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="relative inline-block">
          <Sparkles className="absolute -left-6 -top-6 h-12 w-12 animate-pulse text-orange-400" />
          <h1 className="mb-8 text-5xl font-bold text-gray-800">
            Find Expert
            <span className="mx-4 text-orange-600">
              {currentCuisine}
            </span>
            Personal Chefs
          </h1>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-grow">
                <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400" />
                <select className="w-full appearance-none rounded-full border bg-transparent py-4 pl-12 pr-4">
                  <option>Select Cuisine</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400" />
                <Input 
                  label=""
                  value=""
                  onChange={() => {}} // Add empty handler
                  placeholder="Your Location"
                  icon={<Search className="h-5 w-5" />}
                />
              </div>
              <Button variant="primary">
                Find Your Chef
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

