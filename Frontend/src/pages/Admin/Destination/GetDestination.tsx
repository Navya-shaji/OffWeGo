import { useEffect, useState } from "react";
import { fetchAllDestinations, updateDestination } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { Edit, Trash2 } from "lucide-react";

export const DestinationTable = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationInterface | null>(null);

  const handleEdit = (dest: DestinationInterface) => {
    setSelectedDestination(dest);
    setIsEditModalOpen(true);
  };

  const handleDelete = (dest: DestinationInterface) => {
    console.log("Delete destination:", dest);
  };

  const fetchData = async () => {
    try {
      const data = await fetchAllDestinations();
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestination) return;

    try {
      await updateDestination();
      await fetchData();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.map((dest, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="h-16 w-16">
                    {dest.imageUrls?.[0] ? (
                      <img src={dest.imageUrls[0]} alt={dest.name} className="h-16 w-16 object-cover rounded-lg" />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>
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
                    <button
                      onClick={() => handleDelete(dest)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
      {isEditModalOpen && selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Destination</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="Name"
                value={selectedDestination.name}
                onChange={(e) => setSelectedDestination({ ...selectedDestination, name: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Location"
                value={selectedDestination.location}
                onChange={(e) => setSelectedDestination({ ...selectedDestination, location: e.target.value })}
              />
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={selectedDestination.description}
                onChange={(e) => setSelectedDestination({ ...selectedDestination, description: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Image URL"
                value={selectedDestination.imageUrls?.[0] || ""}
                onChange={(e) =>
                  setSelectedDestination({
                    ...selectedDestination,
                    imageUrls: [e.target.value],
                  })
                }
              />
              <div className="flex gap-2">
                <input
                  className="w-1/2 border p-2 rounded"
                  type="number"
                  placeholder="Latitude"
                  value={selectedDestination.coordinates?.lat ?? ""}
                  onChange={(e) =>
                    setSelectedDestination({
                      ...selectedDestination,
                      coordinates: {
                        ...selectedDestination.coordinates,
                        lat: parseFloat(e.target.value),
                      },
                    })
                  }
                />
                <input
                  className="w-1/2 border p-2 rounded"
                  type="number"
                  placeholder="Longitude"
                  value={selectedDestination.coordinates?.lng ?? ""}
                  onChange={(e) =>
                    setSelectedDestination({
                      ...selectedDestination,
                      coordinates: {
                        ...selectedDestination.coordinates,
                        lng: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
