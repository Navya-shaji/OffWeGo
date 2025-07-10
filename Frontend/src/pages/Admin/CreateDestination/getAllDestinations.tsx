import { useEffect, useState } from "react";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";

export const AllDestinations = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await fetchAllDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">All Destinations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, idx) => (
          <div key={idx} className="border p-4 rounded-lg shadow bg-white">
            {dest.imageUrls?.length > 0 ? (
              <div className="flex overflow-x-auto gap-2 rounded scrollbar-thin scrollbar-thumb-gray-400">
                {dest.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${dest.name} - ${i + 1}`}
                    className="h-40 w-60 object-cover flex-shrink-0 rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="h-40 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded">
                No Image Available
              </div>
            )}

            <h3 className="mt-4 font-bold text-lg">{dest.name}</h3>
            <p className="text-sm text-gray-600">{dest.location}</p>
            <p className="text-sm mt-1">{dest.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
