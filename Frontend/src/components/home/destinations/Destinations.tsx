import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  fetchAllDestinations,
  getNearbyDestinations,
  searchDestination,
} from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { ChevronLeft, ChevronRight, MapPin, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface DestinationsProps {
  id?: string;
}

const Destinations = ({ id }: DestinationsProps) => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [originalDestinations, setOriginalDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isNearbyMode, setIsNearbyMode] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllDestinations(1, 50);
      setDestinations(response.destinations || []);
      setOriginalDestinations(response.destinations || []);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Failed to load destinations. Please try again.");
      setDestinations([]);
      setOriginalDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNearby = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsNearbyMode(true);
      setIsSearchMode(false);
      setSearchQuery("");

      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        setIsNearbyMode(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const radiusInKm = 50;

          try {
            const response = await getNearbyDestinations(lat, lng, radiusInKm);
            console.log("Nearby API Response:", response);
            
        
            let destinationsData = [];
            
            if (response?.data?.data && Array.isArray(response.data.data)) {
            
              destinationsData = response.data.data;
            } else if (response?.data && Array.isArray(response.data)) {
              destinationsData = response.data;
            } else if (Array.isArray(response)) {
              destinationsData = response;
            }
            
            console.log("Setting destinations:", destinationsData);
            setDestinations(destinationsData);
          } catch (err) {
            console.error("Nearby fetch error:", err);
            setError("Failed to load nearby destinations.");
            setIsNearbyMode(false);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get your location. Please enable location access.");
          setLoading(false);
          setIsNearbyMode(false);
        }
      );
    } catch (err) {
      console.error("Nearby fetch error:", err);
      setError("Failed to load nearby destinations.");
      setLoading(false);
      setIsNearbyMode(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchDestinations]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setIsNearbyMode(false);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (!query.trim()) {
          setIsSearchMode(false);
          setDestinations(originalDestinations);
          return;
        }

        try {
          setSearching(true);
          setError(null);
          setIsSearchMode(true);
          const response = await searchDestination(query);
          setDestinations(Array.isArray(response) ? response : []);
        } catch (err) {
          console.error("Search error:", err);
          setError("Search failed. Please try again.");
          setDestinations([]);
        } finally {
          setSearching(false);
        }
      }, 500);
    },
    [originalDestinations]
  );

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
    
      <div className="relative bg-black text-white py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <span className="inline-block text-xs font-semibold tracking-[0.3em] text-white/60 uppercase mb-6">
              Where to next
            </span>
            <h2 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
              Featured
              <span className="block font-bold">Destinations</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl font-light">
              Handpicked destinations that inspire wanderlust and create unforgettable experiences
            </p>
          </div>

          <button
            onClick={fetchNearby}
            className="bg-white text-black px-8 py-4 font-semibold hover:bg-white/90 transition-all duration-300"
          >
            Find Nearby Destinations
          </button>

          {/* Search Bar */}
          <div className="max-w-2xl mt-12">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search destinations, cities, countries..."
                className="w-full pl-16 pr-16 py-5 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors duration-300 backdrop-blur-sm"
              />
              {searching && (
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="animate-spin w-5 h-5 text-white/60" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

 
      <div className="container mx-auto px-6 py-24 max-w-7xl">

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-8 py-6 mb-12 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{error}</span>
              <button
                onClick={fetchDestinations}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-semibold transition-colors duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-black/40" />
              <span className="text-sm font-semibold tracking-wider text-black/60 uppercase">
                {isNearbyMode 
                  ? 'Nearby Destinations' 
                  : isSearchMode 
                  ? `Search Results` 
                  : `${destinations.length} Destinations`}
              </span>
            </div>
            {isSearchMode && (
              <p className="text-lg text-black/60 font-light">
                Showing results for <span className="font-semibold text-black">"{searchQuery}"</span>
              </p>
            )}
            {isNearbyMode && (
              <p className="text-lg text-black/60 font-light">
                Showing destinations within <span className="font-semibold text-black">50km</span> of your location
              </p>
            )}
          </div>

          {(isSearchMode || isNearbyMode) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchMode(false);
                setIsNearbyMode(false);
                setDestinations(originalDestinations);
              }}
              className="bg-black hover:bg-black/80 text-white px-8 py-3 font-semibold transition-all duration-300"
            >
              View All Destinations
            </button>
          )}
        </div>

   
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-black/60 animate-spin mx-auto mb-6" />
              <p className="text-2xl text-black/80 font-light">Loading destinations...</p>
            </div>
          </div>
        ) : destinations.length === 0 ? (
      
          <div className="text-center py-32 border border-black/10 max-w-3xl mx-auto">
            <MapPin className="w-24 h-24 text-black/20 mx-auto mb-8" />
            <h3 className="text-4xl font-light text-black mb-4">
              No destinations found
            </h3>
            <p className="text-lg text-black/60 mb-10 max-w-md mx-auto font-light">
              {isNearbyMode
                ? "No destinations found near your location. Try increasing the search radius or view all destinations."
                : isSearchMode
                ? `We couldn't find any destinations matching "${searchQuery}". Try a different search term.`
                : "No destinations are available at the moment. Please check back later."}
            </p>
            {(isSearchMode || isNearbyMode) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchMode(false);
                  setIsNearbyMode(false);
                  setDestinations(originalDestinations);
                }}
                className="bg-black hover:bg-black/80 text-white px-10 py-4 font-semibold text-lg transition-colors duration-300"
              >
                View All Destinations
              </button>
            )}
          </div>
        ) : (
        
          <div className="relative">
        
            <div className="flex justify-end gap-3 mb-8">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-12 h-12 border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Destinations Row */}
            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {destinations.map((destination, idx) => (
                <DestinationCard
                  key={destination.id || `dest-${idx}-${destination.name}`}
                  destination={destination}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DestinationCard = React.memo(
  ({ destination }: { destination: DestinationInterface }) => {
    return (
      <Link
        to={`/destination/${destination.id}`}
        className="flex-shrink-0 w-[385px] h-[500px] group cursor-pointer"
      >
        <div className="bg-white h-full flex flex-col transition-all duration-300 hover:shadow-xl" style={{ borderRadius: '20px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
          {/* Image Container */}
          <div className="relative h-[240px] overflow-hidden" style={{ borderRadius: '20px 20px 0 0' }}>
            {destination.imageUrls?.length > 0 ? (
              <img
                src={destination.imageUrls[0]}
                alt={destination.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No Image Available</p>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 text-sm font-medium">
                {destination.location}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-gray-900 text-xl font-bold mb-3 leading-tight">
              {destination.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
              {destination.description ||
                "Discover this amazing destination and create unforgettable memories."}
            </p>
          </div>
        </div>
      </Link>
    );
  }
);

export default Destinations;