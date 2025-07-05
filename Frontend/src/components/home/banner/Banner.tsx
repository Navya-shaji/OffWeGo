import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Banner: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1920&h=1080&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Find Next Place To Visit
        </h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Discover amazing destinations and create unforgettable memories
        </p>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 max-w-2xl mx-auto shadow-2xl">
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center space-x-2 px-4">
              <MapPin className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Where do you want to go?"
                className="border-0 focus:ring-0 text-gray-800 text-lg bg-transparent"
              />
            </div>
            <Button className="rounded-full bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 px-8 text-white">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
