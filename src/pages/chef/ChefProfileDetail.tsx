// src/pages/chef/ChefProfileDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { Star } from 'lucide-react';
import { Chef } from '../../types/chef.types';
import { Menu } from '../../types/menu.types';
import { API_BASE_URL } from '../../config/api.config';

export default function ChefProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chef, setChef] = useState<Chef | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchChefDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/chefs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chef details');
        }
        const data = await response.json();
        setChef(data);

        console.log('Fetching menus for chef:', id);
        const menuResponse = await fetch(`${API_BASE_URL}/api/menus/chef/${id}`);
        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          console.log('Received menu data:', menuData);
          setMenus(menuData);
        } else {
          console.error('Failed to fetch menus:', menuResponse.status);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load chef details');
      } finally {
        setLoading(false);
      }
    };

    fetchChefDetails();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !chef) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>{error || 'Chef not found'}</p>
            <button
              onClick={() => navigate('/chefs')}
              className="mt-2 text-orange-600 hover:text-orange-700"
            >
              Back to Chefs
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative h-64 bg-orange-600">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex flex-wrap gap-8">
              <img 
                src={chef.imageUrl || "/api/placeholder/160/160"} 
                alt={chef.name}
                className="h-40 w-40 rounded-xl object-cover shadow-lg"
              />
              <div className="flex-grow">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{chef.name}</h1>
                    <p className="text-lg text-gray-600">
                      {Array.isArray(chef.cuisine) 
                        ? chef.cuisine.join(', ') 
                        : chef.cuisine}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      console.log('1. Current menus:', menus);

                      if (!menus || menus.length === 0) {
                        setError("No menus available for booking");
                        return;
                      }
                      
                      const selectedMenu = menus[0];
                      console.log('2. Selected menu:', selectedMenu);
                      
                      // Handle nested MongoDB ObjectId structure
                      const menuId = typeof selectedMenu._id === 'object' ? selectedMenu._id.$oid : selectedMenu._id;
                      console.log('3. Extracted menuId:', menuId);
                      
                      if (!menuId) {
                        console.error('4. Menu validation failed:', {
                          hasSelectedMenu: !!selectedMenu,
                          menuId: menuId
                        });
                        setError("Invalid menu selection");
                        return;
                      }

                      const bookingState = {
                        chefId: id,
                        menuId: menuId,
                        chefDetails: {
                          name: chef.name,
                          cuisine: chef.cuisine,
                          imageUrl: chef.imageUrl
                        }
                      };

                      console.log('5. Booking state created:', bookingState);
                      navigate('/booking', { state: bookingState });
                    }}
                    className="rounded-full bg-orange-600 px-8 py-3 text-white shadow-lg transition-all hover:bg-orange-700"
                  >
                    Book Now
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">{chef.rating}</span>
                    <span className="text-gray-600">({chef.reviews} reviews)</span>
                  </div>
                  {chef.profile?.yearsOfExperience && (
                    <>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-600">
                        {chef.profile.yearsOfExperience} years experience
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">About</h2>
              <p className="text-gray-600">{chef.profile?.bio || 'No bio available'}</p>
            </div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">Specialties</h2>
              <div className="flex flex-wrap gap-3">
                {chef.profile?.specialties?.map((specialty, index) => (
                  <span 
                    key={`specialty-${specialty}-${index}`}
                    className="rounded-full bg-orange-100 px-4 py-2 text-orange-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">Available Menus</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {menus.map((menu, index) => (
                  <div 
                    key={`menu-${menu.id || index}`}
                    className="rounded-lg border bg-gray-50 p-4"
                  >
                    <h3 className="text-lg font-semibold">{menu.name}</h3>
                    <p className="mt-2 text-gray-600">{menu.description}</p>
                    <div className="mt-4">
                      <p className="font-medium">Price per person: ${menu.pricePerPerson}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {menu.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                ))}
                {menus.length === 0 && (
                  <p className="text-gray-500">No menus available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">Booking Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Location</h3>
                  <p className="text-gray-600">{chef.profile?.location || 'Location not specified'}</p>
                </div>
                <button 
                  onClick={() => navigate('/booking')}
                  className="w-full rounded-full bg-orange-600 py-3 text-white shadow-lg transition-all hover:bg-orange-700"
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}