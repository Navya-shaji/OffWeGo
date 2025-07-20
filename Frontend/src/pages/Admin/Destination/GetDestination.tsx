import { useEffect, useState } from "react";
import {fetchAllDestinations,updateDestination,} from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { Edit } from "lucide-react";
import { EditDestinationModal } from "./destinationModal";

export const DestinationTable = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationInterface | null>(null);

  const fetchData = async () => {
    try {
      const data: DestinationInterface[] = await fetchAllDestinations();
      setDestinations(data);
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (dest: DestinationInterface) => {
    setSelectedDestination(dest);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(" handleUpdate started");

    if (!selectedDestination?.id) {
      console.warn(
        "⚠️ No selectedDestination or missing id",
        selectedDestination
      );
      return;
    }

    try {
      await updateDestination(selectedDestination.id, selectedDestination);
      console.log(" Updated destination:", selectedDestination.id);
      await fetchData();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(" Update failed:", err);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Destinations</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.map((dest) => (
              <tr key={dest.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="h-16 w-16">
                    {Array.isArray(dest.imageUrls) && dest.imageUrls[0] ? (
                      <img
                        src={dest.imageUrls[0]}
                        alt={dest.name}
                        className="h-16 w-16 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"; // or show a fallback here
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </td>
                

                <td className="px-6 py-4">{dest.name}</td>
                <td className="px-6 py-4">{dest.location}</td>
                <td className="px-6 py-4 max-w-xs">{dest.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(dest)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedDestination && (
        <EditDestinationModal
          destination={selectedDestination}
          onClose={() => setIsEditModalOpen(false)}
          onChange={(updated) => setSelectedDestination(updated)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};
