import { useEffect, useState } from "react";
import { fetchAllDestinations } from '@/services/Destination/destinationService'
import type { DestinationInterface } from "@/interface/destinationInterface"; 

export const DestinationTable = () => {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div className="border p-4 rounded-lg shadow">
            <img src={dest.imageUrls[0]} alt={dest.name} className="h-40 w-full object-cover rounded" />
            <h3 className="mt-2 font-bold text-lg">{dest.name}</h3>
            <p className="text-sm text-gray-600">{dest.location}</p>
            <p className="text-sm mt-1">{dest.description}</p>
          </div>
        ))}
        
      </div>
    </div>
  );
};
