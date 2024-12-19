// src/pages/chef/ChefProfile.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { ChefProfileHeader } from '../../components/chef/ChefProfileHeader';
import { ChefCard } from '../../components/chef/ChefCard';

// Featured chef data structure provides comprehensive information about our primary chef
const featuredChef = {
  id: '1',  
  name: "Chef Janaki Baniya",
  specialty: "Himalayan & Indian Cuisine Specialist",
  bio: "As a certified chef specializing in authentic Himalayan and Indian cuisine, I bring the rich flavors and traditions of my heritage to your table. Food safety is my top priority - I ensure a meticulous approach to food handling and preparation throughout the entire cooking process. My passion lies in creating memorable dining experiences that not only delight your taste buds but also meet the highest standards of food safety and quality. Each dish I prepare tells a story of tradition while adhering to modern food safety practices.",
  experience: 15,
  rating: 4.9,
  reviewCount: 42,
  imageUrl: "/api/placeholder/150/150",
  location: "Fairfax/Herndon Area, Virginia",
  availability: "Available weekdays and weekends",
  certifications: [
    "Certified Food Protection Manager (CFPM) - Virginia Department of Health",
    "Food Safety Certification - ServSafe®"
  ],
  specialties: [
    'Nepali Cuisine',
    'North Indian',
    'Himalayan Specialties',
    'Festival Dishes',
    'Traditional Spice Blending',
    'Vegetarian Options',
    'Dietary Accommodations'
  ]
};

// Local chefs data represents other verified chefs in our service area
const localChefs = [
  {
    id: '2',
    name: 'Chef Priya Sharma',
    cuisine: 'North Indian Cuisine',
    rating: 4.8,
    reviews: 36,
    location: 'Reston/Herndon Area',
    specialties: ['Punjabi Specialties', 'Vegetarian'],
    imageUrl: '/api/placeholder/100/100'
  },
  {
    id: '3',
    name: 'Chef Pemba Sherpa',
    cuisine: 'Nepali & Tibetan Cuisine',
    rating: 4.7,
    reviews: 29,
    location: 'Fairfax Area',
    specialties: ['Momos Specialist', 'Traditional'],
    imageUrl: '/api/placeholder/100/100'
  },
  {
    id: '4',
    name: 'Chef Raj Kumar',
    cuisine: 'South Indian Cuisine',
    rating: 4.9,
    reviews: 32,
    location: 'Vienna/Fairfax Area',
    specialties: ['Dosa Specialist', 'Authentic'],
    imageUrl: '/api/placeholder/100/100'
  }
];

export default function ChefProfilePage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleViewProfile = (chefId: string) => {
    navigate(`/chef/${chefId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-600">Loading chef profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Featured Chef Profile Section */}
        <ChefProfileHeader 
          chef={featuredChef}
          onBookNow={handleBookNow}
        />

        {/* Local Chefs Section */}
        <div className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-800">
            More Chefs in Fairfax/Herndon Area
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {localChefs.map((chef) => (
              <ChefCard
                key={chef.id}
                name={chef.name}
                cuisine={chef.cuisine}
                rating={chef.rating}
                reviews={chef.reviews}
                location={chef.location}
                specialties={chef.specialties}
                imageUrl={chef.imageUrl}
                onViewProfile={() => handleViewProfile(chef.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}