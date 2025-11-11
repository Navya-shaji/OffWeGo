import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  fetchAllDestinations,
  searchDestination,
} from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react";
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
console.log(id)
  useEffect(() => {
    fetchDestinations();
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchDestinations]);

  // Debounced search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

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
      }, 500); // debounce delay
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
      {/* Search Bar */}
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search destinations, cities, countries..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-full border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-900"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={fetchDestinations}
                className="text-red-800 hover:text-red-900 underline font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-serif text-gray-900 mb-2">
                {isSearchMode
                  ? `Search Results for "${searchQuery}"`
                  : "All Destinations"}
              </h2>
              <p className="text-gray-600">
                {destinations.length} destination
                {destinations.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {isSearchMode && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchMode(false);
                  setDestinations(originalDestinations);
                }}
                className="mt-4 sm:mt-0 text-blue-600 hover:text-blue-800 underline"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* No Results */}
        {destinations.length === 0 && !loading ? (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No destinations found
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {isSearchMode
                ? `We couldn't find any destinations matching "${searchQuery}". Try a different search term.`
                : "No destinations are available at the moment. Please check back later."}
            </p>
          </div>
        ) : (
          /* Horizontal Scroll Container */
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Scroll Buttons */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20 bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-7 h-7 text-gray-600" />
              </button>

              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20 bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-7 h-7 text-gray-600" />
              </button>

              {/* Scrollable Destinations Row */}
              <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide py-8"
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
          </div>
        )}
      </div>
    </div>
  );
};

const DestinationCard = React.memo(
  ({ destination }: { destination: DestinationInterface }) => {
    return (
      <div className="flex-shrink-0 w-96">
        <Link
          to={`/destination/${destination.id}`}
          className="relative group cursor-pointer block"
        >
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
            {destination.imageUrls?.length > 0 ? (
              <img
                src={destination.imageUrls[0]}
                alt={`${destination.name}, ${destination.location}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                  <span className="text-gray-600 text-lg">
                    No Image Available
                  </span>
                </div>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-bold mb-3 leading-tight">
                {destination.name}
              </h3>
              <p className="text-lg text-gray-200 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {destination.location}
              </p>
              <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3 leading-relaxed">
                {destination.description ||
                  "Discover this amazing destination and create unforgettable memories."}
              </p>

            
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-colors">
                  Explore Destination →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export default Destinations;
