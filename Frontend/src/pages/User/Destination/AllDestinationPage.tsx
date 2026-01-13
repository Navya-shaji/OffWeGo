/* eslint-disable react-hooks/exhaustive-deps */
import { MapPin, Loader2, Search, Star, Clock, Users, TrendingUp, Globe } from "lucide-react";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { resolveCloudinaryUrl } from "@/utilities/cloudinaryUpload";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/home/navbar/Header";
import { motion, AnimatePresence } from "framer-motion";

const AllDestinationsPage = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationInterface[]>([]);

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    filterDestinations();
  }, [destinations, searchQuery]);

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

    setFilteredDestinations(filtered);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full mx-auto mb-4"
          />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Discovering Destinations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header forceSolid />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-32 pb-16 px-6 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-4">
              Explore the World
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover breathtaking destinations, from tropical paradises to majestic mountains. Your next adventure awaits.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, locations, experiences..."
                className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-200 rounded-full focus:ring-4 focus:ring-black/5 focus:border-black transition-all text-base font-medium shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {filteredDestinations.length} Destinations Found
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm font-bold text-gray-600 hover:text-black transition-colors"
            >
              Clear Search
            </button>
          )}
        </motion.div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Destinations Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search or filters to discover amazing destinations.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredDestinations.map((destination, idx) => {
                const destinationId = destination.id ?? destination._id;
                return (
                  <motion.div
                    key={destinationId ?? `destination-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Link
                      to={destinationId ? `/destination/${destinationId}` : "/destinations"}
                      className="group block h-full"
                    >
                      <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100 hover:border-black h-full">
                        {/* Image */}
                        <div className="h-64 overflow-hidden relative">
                          {destination.imageUrls?.length > 0 ? (
                            <img
                              src={
                                resolveCloudinaryUrl(destination.imageUrls[0], "image") ??
                                destination.imageUrls[0]
                              }
                              alt={destination.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <Globe className="w-16 h-16 text-gray-300" />
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Rating Badge */}
                          {destination.rating && (
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                              <div className="flex items-center gap-1 text-sm font-black">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{destination.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-grow flex flex-col">
                          <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-black transition-colors tracking-tight">
                            {destination.name}
                          </h2>

                          <div className="flex items-center gap-2 mb-3 text-gray-500">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm font-medium">{destination.location}</p>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-3 flex-grow leading-relaxed mb-4">
                            {destination.description || "Explore this beautiful destination and experience unforgettable moments!"}
                          </p>

                          {/* Quick Stats */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1 font-bold">
                                <Users className="w-3 h-3" />
                                {destination.visitorCount || "Popular"}
                              </span>
                              <span className="flex items-center gap-1 font-bold">
                                <Clock className="w-3 h-3" />
                                {destination.bestTimeToVisit || "Year-round"}
                              </span>
                            </div>
                          </div>

                          {/* Explore Button */}
                          <div className="mt-4">
                            <div className="w-full py-3 bg-black text-white text-center font-black text-xs uppercase tracking-widest rounded-xl group-hover:bg-gray-900 transition-colors">
                              Explore Destination
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Load More Button */}
        {hasMore && filteredDestinations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              disabled={loading}
              className="px-10 py-4 bg-black text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3 shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading More...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Load More Destinations
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllDestinationsPage;