import React, { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Users, Phone, Globe, Instagram, Facebook, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Banner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
      {/* Decorative Leaves */}
      <div className="absolute top-10 left-10 w-16 h-16 opacity-30">
        <div className="w-full h-full bg-green-500 rounded-full transform -rotate-12 animate-float"></div>
      </div>
      <div className="absolute top-32 right-20 w-12 h-12 opacity-40">
        <div className="w-full h-full bg-green-400 rounded-full transform rotate-45 animate-float-delayed"></div>
      </div>
      <div className="absolute bottom-20 left-16 w-10 h-10 opacity-35">
        <div className="w-full h-full bg-green-600 rounded-full transform -rotate-45 animate-float"></div>
      </div>

      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            
            {/* Header */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-light text-gray-700 italic">
                Love Your
              </h2>
              <h1 className="text-5xl md:text-6xl font-bold text-orange-500 leading-tight">
                DESTINATION
              </h1>
              <h3 className="text-2xl md:text-3xl font-light text-orange-400 italic">
                Explore Bali
              </h3>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Discover the magical island of Bali with its stunning beaches, ancient temples, and vibrant culture. Create unforgettable memories in paradise.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700">
                <Phone className="h-5 w-5" />
                <span className="font-medium">0123-4567-7890</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Globe className="h-5 w-5" />
                <span className="font-medium">www.yourwebsite.com</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Where to?"
                    className="border-0 focus:ring-0 text-gray-700 bg-transparent p-0 placeholder:text-gray-400"
                  />
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="When?"
                    className="border-0 focus:ring-0 text-gray-700 bg-transparent p-0 placeholder:text-gray-400"
                  />
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                  <Users className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Guests?"
                    className="border-0 focus:ring-0 text-gray-700 bg-transparent p-0 placeholder:text-gray-400"
                  />
                </div>
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold">
                  <Search className="h-5 w-5 mr-2" />
                  Search Destinations
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            
            {/* Main Background Image */}
            <div className="relative">
              <div 
                className="w-full h-96 bg-cover bg-center rounded-lg shadow-2xl"
                style={{
                  backgroundImage: "url(https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop)"
                }}
              >
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                
                {/* Traveler silhouette overlay */}
                <div className="absolute bottom-6 right-6 text-white">
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-medium">Adventure Awaits</p>
                  </div>
                </div>
              </div>

              {/* Polaroid Photos */}
              <div className="absolute -top-8 -left-8 transform rotate-12 animate-float">
                <div className="bg-white p-3 shadow-lg rounded-sm">
                  <div 
                    className="w-32 h-24 bg-cover bg-center"
                    style={{
                      backgroundImage: "url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop)"
                    }}
                  ></div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-12 transform -rotate-6 animate-float-delayed">
                <div className="bg-white p-3 shadow-lg rounded-sm">
                  <div 
                    className="w-28 h-20 bg-cover bg-center"
                    style={{
                      backgroundImage: "url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop)"
                    }}
                  ></div>
                </div>
              </div>

              <div className="absolute -top-4 -right-8 transform rotate-6 animate-float">
                <div className="bg-white p-3 shadow-lg rounded-sm">
                  <div 
                    className="w-24 h-18 bg-cover bg-center"
                    style={{
                      backgroundImage: "url(https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop)"
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <div className="absolute bottom-8 right-8">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                BOOK NOW
              </Button>
            </div>

            {/* Social Media Icons */}
            <div className="absolute top-8 right-8 space-y-3">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium mb-2">Travel List</p>
                <div className="flex space-x-2 justify-end">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                    <Twitter className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  )
}

export default Banner