import { useEffect, useState } from "react";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { Link } from "react-router-dom";

export const DestinationsPage = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const extractImageUrl = (htmlString: string) => {
    const match = htmlString.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await fetchAllDestinations(1, 1000);
        setDestinations(data.destinations);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-20">{error}</div>;
  }

  return (
    <div id="destinations" className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-gray-900 mb-12 text-left">
          All Available Destinations
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((dest, idx) => (
            <Link
              key={idx}
              to={`/destination/${dest.id}`}
              className="relative group cursor-pointer block"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                {dest.imageUrls?.length > 0 ? (
                  <img
                    src={
                      extractImageUrl(dest.imageUrls[0]) ||
                      "/placeholder-image.png"
                    }
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">
                      No Image Available
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">
                    {dest.name}, {dest.location}
                  </h3>
                  <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
