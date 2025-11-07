import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Users, Calendar, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/store/store';
import { getAllBuddyPackages, joinBuddyTravel } from '@/services/BuddyTravel/buddytravelService';
import axiosInstance from '@/axios/instance';

interface BuddyPackage {
  _id: string;
  title: string;
  destination: string;
  category: string;
  duration: string;
  price: number;
  maxPeople: number;
  image: string;
  description: string;
  joinedUsers: string[];
  startDate: string;
  endDate: string;
}

// interface Category {
//   _id: string;
//   name: string;
// }

const Travalbuddies = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const navigate = useNavigate();

  const [packages, setPackages] = useState<BuddyPackage[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joiningPackageId, setJoiningPackageId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const packagesRes = await getAllBuddyPackages();
      
      let packagesData: BuddyPackage[] = [];
      if (packagesRes.data && Array.isArray(packagesRes.data)) {
        packagesData = packagesRes.data;
      } else if (Array.isArray(packagesRes)) {
        packagesData = packagesRes;
      }

      setPackages(packagesData);

      // const categoriesRes = await axiosInstance.get('/api/admin/categories', {
      //   params: { page: 1, limit: 100 }
      // });
      // setCategories(categoriesRes.data.categories || []);

      if (packagesData.length > 0) {
        const uniqueDestinations = [...new Set(packagesData.map((pkg: BuddyPackage) => pkg.destination))].filter(Boolean);
        setDestinations(uniqueDestinations);
      }

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPackage = async (pkg: BuddyPackage) => {
    if (!userId) {
      setError('Please login to join a package');
      return;
    }

    if (pkg.joinedUsers?.includes(userId)) {
      setError('You have already joined this package');
      return;
    }

    if (pkg.joinedUsers?.length >= pkg.maxPeople) {
      setError('This package is already full');
      return;
    }

    try {
      setJoiningPackageId(pkg._id);
      setError('');

      const bookingData = {
        packageId: pkg._id,
        userId: userId,
        title: pkg.title,
        destination: pkg.destination,
        price: pkg.price,
        duration: pkg.duration,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
      };

   
navigate('/payment-buddycheckout', {
  state: {
    buddyTravelData: bookingData,
    amount: pkg.price,
  },
});



    } catch (err: any) {
      console.error('Error preparing checkout:', err);
      setError(err.message || 'Failed to proceed to checkout. Please try again.');
      setJoiningPackageId(null);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDestination('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedDestination || searchQuery;

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = !selectedCategory || pkg.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDestination = !selectedDestination || pkg.destination?.toLowerCase() === selectedDestination.toLowerCase();
    const matchesSearch = !searchQuery || 
      pkg.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDestination && matchesSearch;
  });

  const isUserJoined = (pkg: BuddyPackage) => {
    return userId && pkg.joinedUsers?.includes(userId);
  };

  const isFull = (pkg: BuddyPackage) => {
    return pkg.joinedUsers?.length >= pkg.maxPeople;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Travel Buddy</h1>
          <p className="text-gray-600">Discover amazing destinations and connect with fellow travelers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[selectedCategory, selectedDestination, searchQuery].filter(Boolean).length}
                </span>
              )}
            </button>

            <div className="hidden md:flex gap-4">
              {/* <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select> */}

              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
              >
                <option value="">All Destinations</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2 whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t space-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Destinations</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )} */}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDestination && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Destination: {selectedDestination}
                <button onClick={() => setSelectedDestination('')} className="hover:bg-green-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:bg-purple-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {filteredPackages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg mb-2">No packages found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600 shadow-md">
                    ${pkg.price}
                  </div>
                  {isFull(pkg) && !isUserJoined(pkg) && (
                    <div className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                      FULL
                    </div>
                  )}
                  {isUserJoined(pkg) && (
                    <div className="absolute top-3 left-3 bg-green-500 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      JOINED
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{pkg.destination}</span>
                    </div>
                    {pkg.duration && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        {pkg.duration}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {pkg.joinedUsers?.length || 0}/{pkg.maxPeople} joined
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {pkg.category && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {pkg.category}
                      </span>
                    )}
                    <button
                      onClick={() => handleJoinPackage(pkg)}
                      disabled={isUserJoined(pkg) || isFull(pkg) || joiningPackageId === pkg._id || !userId}
                      className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 ${
                        isUserJoined(pkg)
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : isFull(pkg)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : !userId
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : joiningPackageId === pkg._id
                          ? 'bg-blue-400 text-white cursor-wait'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {joiningPackageId === pkg._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : isUserJoined(pkg) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Joined
                        </>
                      ) : isFull(pkg) ? (
                        'Full'
                      ) : !userId ? (
                        'Login to Join'
                      ) : (
                        'Join Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Travalbuddies;