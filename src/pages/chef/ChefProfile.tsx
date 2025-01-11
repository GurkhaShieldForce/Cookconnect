// src/pages/chef/ChefProfile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { Star, MapPin, Search } from 'lucide-react'; // Removed unused Award
import { Chef } from '../../types/chef.types';
import { Menu } from '../../types/menu.types';
import { API_BASE_URL } from '../../config/api.config';

// Helper function to handle cuisine display
const formatCuisine = (cuisine: string | string[]): string => {
  if (Array.isArray(cuisine)) {
    return cuisine.join(', ');
  }
  // If it's a string, it might be comma-separated, so we'll split and rejoin to ensure consistent formatting
  return cuisine.split(',').map(item => item.trim()).join(', ');
};

export default function ChefProfile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price'>('rating');

  // Removed unused priceRange state

  const [chefMenus, setChefMenus] = useState<{ [key: string]: Menu[] }>({});

  // Add function to fetch menu for a chef
  const fetchChefMenus = async (chefId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menus/chef/${chefId}`);
      if (response.ok) {
        const menus = await response.json();
        setChefMenus(prev => ({
          ...prev,
          [chefId]: menus
        }));
      }
    } catch (error) {
      console.error(`Error fetching menus for chef ${chefId}:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // Fetch user profile if logged in
        if (token) {
          const profileResponse = await fetch('http://localhost:3001/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUserProfile(profileData);
          }
        }

        // Fetch chefs data
        const chefsResponse = await fetch('http://localhost:3001/api/chefs', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!chefsResponse.ok) {
          throw new Error('Failed to fetch chefs');
        }

        const chefsData = await chefsResponse.json();
        setChefs(chefsData);
        
        // Fetch menus for each chef
        chefsData.forEach((chef: Chef) => {
          fetchChefMenus(chef.id);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort chefs based on selected criteria
  const filteredAndSortedChefs = chefs
    .filter(chef => {
      // Search term filter
      const matchesSearch = 
        chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof chef.cuisine === 'string' 
          ? chef.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
          : chef.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));
      
      // Cuisine filter
      const matchesCuisine = 
        selectedCuisine === 'all' || 
        (typeof chef.cuisine === 'string'
          ? chef.cuisine.includes(selectedCuisine)
          : chef.cuisine.includes(selectedCuisine));
      return matchesSearch && matchesCuisine;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return (b.profile.yearsOfExperience || 0) - (a.profile.yearsOfExperience || 0);
        case 'price':
          return (a.pricing?.baseRate || 0) - (b.pricing?.baseRate || 0);
        default:
          return 0;
      }
    });

  // Now we're properly using the loading and error states in the UI
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-orange-600 hover:text-orange-700"
            >
              Try again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* User Profile Section */}
        {userProfile && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <p className="text-orange-800">{userProfile.message}</p>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chefs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>
            </div>
            <select
              title="Filter by cuisine"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Cuisines</option>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
              <option value="Japanese">Japanese</option>
              <option value="Mexican">Mexican</option>
            </select>
            <select
              title="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'price')}
              className="p-2 border rounded-lg"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Found {filteredAndSortedChefs.length} chef{filteredAndSortedChefs.length !== 1 ? 's' : ''}
        </p>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedChefs.map(chef => (
            <div key={chef.id} className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4">
                <img
                  src={chef.imageUrl || "/api/placeholder/100/100"}
                  alt={chef.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{chef.name}</h3>
                  <p className="text-gray-600">{formatCuisine(chef.cuisine)}</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {chef.rating} ({chef.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{chef.profile.location || 'Location not specified'}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(chef.profile?.specialties || []).map((specialty, index) => (
                  <span
                    key={`${chef.id}-specialty-${index}`}
                    className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Add Menu Section */}
              {chefMenus[chef.id] && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Available Menus</h4>
                  <div className="space-y-2">
                    {chefMenus[chef.id].map((menu, index) => (
                      <div 
                        key={`${chef.id}-menu-${menu.id || index}`}
                        className="bg-gray-50 p-3 rounded"
                      >
                        <p className="font-medium">{menu.name}</p>
                        <p className="text-sm text-gray-600">{menu.description}</p>
                        <p className="text-sm font-medium mt-1">
                          ${menu.pricePerPerson} per person
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/chef/${chef.id}`, {
                  state: {
                    chefDetails: {
                      name: chef.name,
                      cuisine: chef.cuisine,
                      imageUrl: chef.imageUrl
                    }
                  }
                })}
                className="mt-4 w-full rounded-full bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 transition-colors"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}