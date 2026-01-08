import { MapPin, Loader2, Search, Navigation, Filter, Star, Clock, Users } from "lucide-react";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { resolveCloudinaryUrl } from "@/utilities/cloudinaryUpload";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/home/navbar/Header";

const AllDestinationsPage = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyDestinations, setNearbyDestinations] = useState<DestinationInterface[]>([]);
  const [showNearby, setShowNearby] = useState(false);

  useEffect(() => {
    fetchData();
    getUserLocation();
  }, [page]);

  useEffect(() => {
    filterDestinations();
  }, [destinations, searchQuery, selectedCategory, sortBy]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          calculateNearbyDestinations(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const calculateNearbyDestinations = (userLat: number, userLng: number) => {
    if (!destinations.length) return;
    
    const nearby = destinations
      .filter(dest => dest.coordinates?.lat && dest.coordinates?.lng)
      .map(dest => ({
        ...dest,
        distance: calculateDistance(userLat, userLng, dest.coordinates.lat, dest.coordinates.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);
    
    setNearbyDestinations(nearby);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllDestinations(page, 12);
      
      setDestinations(prev => page === 1 ? data.destinations : [...prev, ...data.destinations]);
      setHasMore(page < data.totalPages);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDestinations = () => {
    let filtered = destinations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
          return (b.rating || 0) - (a.rating || 0);
        case "nearest":
          if (userLocation && a.coordinates && b.coordinates) {
            const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
            const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
            return distA - distB;
          }
          return 0;
        default:
          return 0;
      }
    });

    setFilteredDestinations(filtered);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const categories = [
    { value: "beach", label: "Beach" },
    { value: "mountain", label: "Mountain" },
    { value: "city", label: "City" },
    { value: "cultural", label: "Cultural" },
    { value: "adventure", label: "Adventure" },
    { value: "nature", label: "Nature" }
  ];

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-lg">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Header />

      <div className="text-center mt-10 mb-8 px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r bg-clip-text text-black drop-shadow-sm mb-3">
          All Destinations
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover breathtaking places across the world — from tropical beaches to scenic mountains.
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Destinations</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, location, or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="popular">Most Popular</option>
                {userLocation && <option value="nearest">Nearest First</option>}
              </select>
            </div>

            {/* Nearby Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Access</label>
              <button
                onClick={() => setShowNearby(!showNearby)}
                disabled={!userLocation}
                className={`w-full px-3 py-3 rounded-lg font-medium transition-colors ${
                  userLocation 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Navigation className="w-4 h-4 inline mr-2" />
                {userLocation ? "Nearby Destinations" : "Location Access Needed"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Destinations Section */}
      {showNearby && nearbyDestinations.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Navigation className="w-6 h-6" />
              Destinations Near You
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nearbyDestinations.map((dest) => (
                <Link
                  key={dest.id ?? `nearby-${dest.name}`}
                  to={dest.id ? `/destination/${dest.id}` : "/destinations"}
                  className="group block"
                >
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-green-100 hover:border-green-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600">{dest.name}</h3>
                      <span className="text-sm text-gray-500">{dest.distance.toFixed(1)} km</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{dest.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Destinations Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {filteredDestinations.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters to find your perfect destination.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-700">
                Showing <span className="font-semibold">{filteredDestinations.length}</span> destinations
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSortBy("name"); }}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Filter className="w-4 h-4 inline mr-1" />
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDestinations.map((destination, idx) => {
                const destinationId = destination.id ?? destination._id;
                return (
                  <Link
                    key={destinationId ?? `destination-${idx}`}
                    to={destinationId ? `/destination/${destinationId}` : "/destinations"}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-orange-400/50 h-[430px] sm:h-[460px] md:h-[480px]">
                      <div className="h-60 overflow-hidden relative">
                        {destination.imageUrls?.length > 0 ? (
                          <img
                            src={
                              resolveCloudinaryUrl(destination.imageUrls[0], "image") ??
                              destination.imageUrls[0]
                            }
                            alt={destination.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-lg">No Image</span>
                          </div>
                        )}
                        
                        {/* Rating Badge */}
                        {destination.rating && (
                          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                            <div className="flex items-center gap-1 text-white text-sm">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{destination.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-grow flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {destination.name}
                        </h2>

                        <div className="flex items-center gap-2 mb-3 text-gray-500">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <p className="text-sm">{destination.location}</p>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-3 flex-grow leading-relaxed">
                          {destination.description || "Explore this beautiful destination and experience unforgettable moments!"}
                        </p>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {destination.visitorCount || "Popular"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {destination.bestTimeToVisit || "Year-round"}
                            </span>
                          </div>
                          <div className="text-orange-600 font-semibold text-sm">
                            Explore →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Destinations"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllDestinationsPage;