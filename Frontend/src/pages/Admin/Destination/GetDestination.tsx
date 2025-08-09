import { useEffect, useState } from "react";
import {
  fetchAllDestinations,
  updateDestination,
  deleteDestination,
  searchDestination,
} from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { Edit, Trash } from "lucide-react";
import { EditDestinationModal } from "./destinationModal";
import Pagination from "@/components/pagination/pagination";
import { SearchBar } from "@/components/Modular/searchbar";

export const DestinationTable = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);

  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationInterface | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


    const handleSearch = async (query: string) => {
      if (!query.trim()) {
        const allDestinations = await fetchAllDestinations(page,5)
        setDestinations(allDestinations.destinations);
        return;
      }
  
      try {
        const response = await searchDestination(query);
        setDestinations(response || []);
      } catch (error) {
        console.error("Error during search:", error);
        setDestinations([]);
      }
    };




  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllDestinations(page, 5);

      const { destinations, totalDestinations } = data;
      console.log("Fetched Data:", data);

      if (Array.isArray(destinations)) {
        setDestinations(destinations);
        setTotalPages(Math.ceil((totalDestinations || 0) / 5));
      } else {
        console.error("Expected destinations to be an array:", destinations);
        setDestinations([]);
      }
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleEdit = (dest: DestinationInterface) => {
    setSelectedDestination(dest);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this destination?"
    );
    if (!confirmed) return;

    try {
      await deleteDestination(id);
      
      fetchData();
    } catch (error) {
      console.error("Failed to delete destination:", error);
      
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDestination?.id) {
      console.warn("Missing selectedDestination or ID");
      return;
    }

    try {
      await updateDestination(selectedDestination.id, selectedDestination);
      fetchData();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
   <div className="p-4">
  
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">All Destinations</h2>
    <div className="w-60">
      <SearchBar placeholder="Search destinations..." onSearch={handleSearch} />
    </div>
  </div>

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
        {Array.isArray(destinations) && destinations.length > 0 ? (
          destinations.map((dest) => (
            <tr key={dest.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="h-16 w-16">
                  {Array.isArray(dest.imageUrls) && dest.imageUrls.length > 0 ? (
                    <img
                      src={dest.imageUrls[0]}
                      alt={dest.name}
                      className="h-16 w-16 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
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
                    className="p-2 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500">
              No destinations found.
            </td>
          </tr>
        )}
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

  <Pagination total={totalPages} current={page} setPage={setPage} />
</div>
  )
};
