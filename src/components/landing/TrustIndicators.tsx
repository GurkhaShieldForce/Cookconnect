// src/components/landing/TrustIndicators.tsx
import { Star, Globe2, Award } from 'lucide-react';

export function TrustIndicators() {
  const indicators = [
    {
      Icon: Star,
      number: "500+",
      label: "Verified Chefs"
    },
    {
      Icon: Globe2,
      number: "50+",
      label: "Cuisine Types"
    },
    {
      Icon: Award,
      number: "10,000+",
      label: "Successful Bookings"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {indicators.map(({ Icon, number, label }) => (
          <div 
            key={label} 
            className="rounded-2xl bg-white/80 p-8 text-center shadow-lg backdrop-blur-md hover:-translate-y-1 transition-transform"
          >
            <Icon className="mx-auto mb-4 h-12 w-12 text-orange-600" />
            <div className="mb-2 text-4xl font-bold text-gray-800">{number}</div>
            <p className="text-gray-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}