// src/components/common/Navigation.tsx
import { useState } from 'react';
import { Menu, X, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="flex items-center space-x-4">
              <Link to="/login" className="rounded-full border-2 border-orange-600 px-6 py-2 text-orange-600 hover:bg-orange-50">
                Sign In
              </Link>
              <Link to="/register" className="rounded-full bg-orange-600 px-6 py-2 text-white hover:bg-orange-700">
                Become a Chef
              </Link>
            </div>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-4 pt-4 pb-3">
              <Link to="/chefs" className="block text-gray-600 hover:text-gray-800">Find a Chef</Link>
              <Link to="/how-it-works" className="block text-gray-600 hover:text-gray-800">How It Works</Link>
              <Link to="/about" className="block text-gray-600 hover:text-gray-800">About Us</Link>
              <Link to="/login" className="block text-gray-600 hover:text-gray-800">Sign In</Link>
              <Link to="/register" className="block text-gray-600 hover:text-gray-800">Become a Chef</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}