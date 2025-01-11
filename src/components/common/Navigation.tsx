// src/components/common/Navigation.tsx
import { useState } from 'react';
import { Menu, X, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; // Add this import

export function Navigation() {
  // Get authentication state and user info from context
  const { isAuthenticated, user, setUser } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log('Navigation rendered:', { 
    isAuthenticated, 
    userType: user?.userType,
    userName: user?.profile?.firstName 
  });

  // Add a logout handler
  const handleLogout = () => {
    // Clear user data from context
    setUser(null);
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-2xl font-bold text-transparent">
              HomeCook Connect
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <div className="space-x-6 text-gray-600">
              <Link to="/chefs" className="hover:text-gray-800">Find a Chef</Link>
              <Link to="/how-it-works" className="hover:text-gray-800">How It Works</Link>
              <Link to="/about" className="hover:text-gray-800">About Us</Link>
            </div>
            
            {/* Conditional rendering based on authentication status */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                // Show these buttons only when user is not authenticated
                <>
                  <Link 
                    to="/login" 
                    className="rounded-full border-2 border-orange-600 px-6 py-2 text-orange-600 hover:bg-orange-50"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="rounded-full bg-orange-600 px-6 py-2 text-white hover:bg-orange-700"
                  >
                    Become a Chef
                  </Link>
                </>
              ) : (
                // Show user menu when authenticated
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                    <span>Welcome, {user?.profile?.firstName || 'User'}</span>
                    <ChefHat className="h-5 w-5" />
                  </button>
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 
                      invisible opacity-0 group-hover:visible group-hover:opacity-100
                      transition-all duration-300 ease-in-out delay-100"
                  >
                    <Link 
                      to={user?.userType === 'chef' ? '/chef/dashboard' : '/customer/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-4 pt-4 pb-3">
              <Link to="/chefs" className="block text-gray-600 hover:text-gray-800">
                Find a Chef
              </Link>
              <Link to="/how-it-works" className="block text-gray-600 hover:text-gray-800">
                How It Works
              </Link>
              <Link to="/about" className="block text-gray-600 hover:text-gray-800">
                About Us
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="block text-gray-600 hover:text-gray-800">
                    Sign In
                  </Link>
                  <Link to="/register" className="block text-gray-600 hover:text-gray-800">
                    Become a Chef
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to={user?.userType === 'chef' ? '/chef/dashboard' : '/customer/dashboard'}
                    className="block text-gray-600 hover:text-gray-800"
                  >
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block text-gray-600 hover:text-gray-800">
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-600 hover:text-gray-800"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}