// src/pages/booking/BookingPage.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { BookingForm } from '../../components/booking/BookingForm';
import MainLayout from '../../layouts/MainLayout';
import { Menu } from '../../types/menu.types';
import { API_BASE_URL } from '../../config/api.config';


interface BookingPageState {
  chefId: string;
  menuId: string;
  chefDetails: {
    name: string;
    cuisine: string | string[];
    imageUrl: string;
  };
}

interface ServiceType {
  id: string;
  title: string;
  price: number;
  description: string;
  minimumGuests: number;
  maximumGuests: number;
}




export default function BookingPage() {
  const { state } = useLocation() as { state: BookingPageState };
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  // Add validation for required state
  useEffect(() => {
    console.log('Received booking state:', state); // Debug received state

    if (!state) {
      console.error('No state received');
      navigate('/chefs');
      return;
    }

    if (!state.chefId) {
      console.error('No chef ID in state');
      navigate('/chefs');
      return;
    }

    if (!state.menuId) {
      console.error('No menu ID in state');
      navigate('/chefs');
      return;
    }

    if (!state.chefDetails) {
      console.error('No chef details in state');
      navigate('/chefs');
      return;
    }
  }, [state, navigate]);

  // Update the services to be dynamic based on the menu


  // Add this useEffect for fetching menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/menus/chef/${state.chefId}`);
        if (!response.ok) throw new Error('Failed to fetch menus');
        
        const menuData = await response.json();
        console.log('Fetched menus:', menuData);
        setMenus(menuData);
        
        // Set the first menu as selected service
        if (menuData.length > 0) {
          const menuId = typeof menuData[0]._id === 'object' 
            ? menuData[0]._id.$oid 
            : menuData[0]._id;
          setSelectedService(menuId);
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        setError('Failed to load menus');
      } finally {
        setLoading(false);
      }
    };

    if (state?.chefId) {
      fetchMenus();
    }
  }, [state?.chefId]);

  useEffect(() => {
    if (menus.length > 0) {
      setServices(menus.map(menu => ({
        id: menu._id.toString(),
        title: menu.name,
        price: menu.pricePerPerson,
        description: menu.description,
        minimumGuests: menu.minimumGuests,
        maximumGuests: menu.maximumGuests
      })));
    }
  }, [menus]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-8 flex items-center gap-6">
              <img
                src={state.chefDetails.imageUrl}
                alt={state.chefDetails.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Book {state.chefDetails.name}</h1>
                <p className="text-lg text-gray-600">
                  {Array.isArray(state.chefDetails.cuisine)
                    ? state.chefDetails.cuisine.join(', ')
                    : state.chefDetails.cuisine}
                </p>
              </div>
            </div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Select Menu</h2>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}
              <div className="grid gap-4">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                      selectedService === service.id
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-100 hover:border-orange-300'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-orange-600" />
                        <h3 className="text-lg font-medium">{service.title}</h3>
                      </div>
                      <span className="text-lg font-semibold text-orange-600">
                        ${service.price}/person
                      </span>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedService && (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold">Complete Your Booking</h2>
                <BookingForm
                  chefId={state.chefId}
                  menuId={selectedService}
                  onSubmit={(data) => {
                    console.log('Booking submitted:', data);
                    // Navigate to payment page with booking details
                    navigate('/payment', {
                      state: {
                        bookingDetails: {
                          ...data,
                          menuName: services.find(s => s.id === selectedService)?.title,
                          pricePerPerson: services.find(s => s.id === selectedService)?.price,
                          serviceFee: 25,
                          chefName: state.chefDetails.name,
                        }
                      }
                    });
                  }}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Booking Summary</h2>
              {selectedService ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <span className="text-gray-600">Menu Price</span>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>
                    <span className="font-medium">
                      ${services.find(s => s.id === selectedService)?.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">$25</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-orange-600">
                      ${(services.find(s => s.id === selectedService)?.price || 0) + 25}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    * Final price will be calculated based on the number of guests
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  Please select a menu to see pricing details
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}