import { useState } from 'react';
import { Star, Award, Calendar, Clock, MapPin, ChefHat } from 'lucide-react';

interface ReviewProps {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

const Review = ({ rating, comment, author, date }: ReviewProps) => (
  <div className="border-b pb-6">
    <div className="mb-2 flex items-center gap-2">
      {[...Array(5)].map((_, index) => (
        <Star 
          key={index}
          className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
    <p className="mb-2 text-gray-600">{comment}</p>
    <p className="text-sm text-gray-500">- {author}, {date}</p>
  </div>
);

export default function ChefProfile() {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleConsultationRequest = () => {
    console.log('Consultation requested for:', selectedDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
      <div className="relative h-64 bg-orange-600">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <div className="relative -mt-20 mb-8">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex flex-wrap gap-8">
              <img 
                src="/api/placeholder/160/160" 
                alt="Chef Portrait" 
                className="h-40 w-40 rounded-xl object-cover shadow-lg"
              />
              <div className="flex-grow">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Chef Maria Santos</h1>
                    <p className="text-lg text-gray-600">Mediterranean & Spanish Cuisine Specialist</p>
                  </div>
                  <button 
                    onClick={handleConsultationRequest}
                    className="rounded-full bg-orange-600 px-8 py-3 text-white shadow-lg transition-all hover:bg-orange-700"
                  >
                    Book Consultation
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">4.9</span>
                    <span className="text-gray-600">(124 reviews)</span>
                  </div>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-600">15 years experience</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-600">500+ meals served</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">About</h2>
              <p className="text-gray-600">
                Classically trained with 15 years of experience in Mediterranean and Spanish cuisine. 
                Specializing in authentic paella, tapas, and regional Spanish dishes. Available for 
                private dining experiences, cooking classes, and special events.
              </p>
            </section>

            <section className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold">Specialties</h2>
              <div className="flex flex-wrap gap-3">
                {['Paella', 'Tapas', 'Seafood', 'Mediterranean', 'Spanish Cuisine'].map(specialty => (
                  <span key={specialty} className="rounded-full bg-orange-100 px-4 py-2 text-orange-800">
                    {specialty}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-2xl font-semibold">Reviews</h2>
              <div className="space-y-6">
                <Review 
                  rating={5}
                  comment="Chef Maria created an incredible Spanish feast for my dinner party. Her paella was absolutely authentic and the tapas selection was outstanding."
                  author="John D."
                  date="2 weeks ago"
                />
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">Booking Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Base Rate</h3>
                  <p className="text-gray-600">Starting at $250 per session</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Availability</h3>
                  <p className="text-gray-600">Available evenings and weekends</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Service Area</h3>
                  <p className="text-gray-600">Greater Boston Area</p>
                </div>
                <button 
                  onClick={handleConsultationRequest}
                  className="w-full rounded-full bg-orange-600 py-3 text-white shadow-lg transition-all hover:bg-orange-700"
                >
                  Check Available Dates
                </button>
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">Credentials</h2>
              <div className="space-y-4">
                {[
                  'Certified Culinary Professional',
                  'ServSafe Certified',
                  '15+ Years Experience'
                ].map(credential => (
                  <div key={credential} className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-orange-600" />
                    <span className="text-gray-600">{credential}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}