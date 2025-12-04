import { MapPin, Loader2 } from "lucide-react";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/home/navbar/Header";

const AllDestinationsPage = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllDestinations(page, 8);
      
      setDestinations(prev => page === 1 ? data.destinations : [...prev, ...data.destinations]);
      setHasMore(page < data.totalPages);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium text-lg">
            Loading destinations...
          </p>
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

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No destinations found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destinations.map((destination) => (
                <Link
                  key={destination.id}
                  to={`/destination/${destination.id}`}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-orange-400/50 h-[430px] sm:h-[460px] md:h-[480px]">
                    <div className="h-60 overflow-hidden relative">
                      <img
                        src={destination.imageUrls[0] || "/default-destination.jpg"}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                    </div>
                  </div>
                </Link>
              ))}
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
                    "Load More"
                  )}
                </button>
              </div>
            )}

            {!hasMore && destinations.length > 0 && (
              <div className="text-center mt-12">
                <p className="text-gray-500 text-sm">You've reached the end!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllDestinationsPage;