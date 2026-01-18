import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { SearchBar } from "@/components/Modular/searchbar";
import type { Flight } from "@/interface/flightInterface";
import {
  fetchAllFlights,
  updateFlight,
  deleteFlight,
} from "@/services/Flight/FlightService";

const FlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [originalFlights, setOriginalFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [ setIsSearchMode] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [formData, setFormData] = useState({
    airLine: "",
    economy: 0,
    premium: 0,
    business: 0,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setIsSearchMode] = useState<boolean>(false);


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null);


  const loadFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchAllFlights();


      // Ensure response is an array
      const flightsArray = Array.isArray(response) ? response : [];
      setFlights(flightsArray);
      setOriginalFlights(flightsArray);

      if (flightsArray.length === 0) {
        console.warn("No flights returned from API");
      }
    } catch (err) {
      console.error("Error loading flights:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load flights";
      setError(errorMessage);
      toast.error(errorMessage);
      setFlights([]);
      setOriginalFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);


  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setIsSearchMode(false);
        setFlights(originalFlights);
        return;
      }

      setIsSearchMode(true);
      const filtered = originalFlights.filter((f) =>
        f.airLine.toLowerCase().includes(query.toLowerCase())
      );
      setFlights(filtered);
    },
    [originalFlights]
  );


  const handleEdit = useCallback((flight: Flight) => {
    setSelectedFlight(flight);
    setFormData({
      airLine: flight.airLine,
      economy: flight.price?.economy || 0,
      premium: flight.price?.premium || 0,
      business: flight.price?.business || 0,
    });
    setIsEditModalOpen(true);
  }, []);

  // Update flight
  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFlight?.id) {
        toast.error("Invalid flight selected");
        return;
      }

      setIsUpdating(true);
      try {
        // Create the updated flight object matching the Flight interface
        const updatedFlightData: Flight = {
          ...selectedFlight, // Keep existing properties like id, createdAt, etc.
          airLine: formData.airLine,
          price: {
            economy: Number(formData.economy),
            premium: formData.premium ? Number(formData.premium) : undefined,
            business: formData.business ? Number(formData.business) : undefined,
          },
        };

        const updatedFlightResponse = await updateFlight(selectedFlight.id, updatedFlightData);

        // Handle different response structures
        const updatedFlight = updatedFlightResponse?.data || updatedFlightResponse || updatedFlightData;

        // Update both the displayed flights and original flights
        const updateFlightsList = (list: Flight[]) =>
          list.map((f) => (f.id === selectedFlight.id ? updatedFlight : f));

        setFlights(updateFlightsList);
        setOriginalFlights(updateFlightsList);

        toast.success("Flight updated successfully");
        setIsEditModalOpen(false);
        setSelectedFlight(null);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Failed to update flight";
        toast.error(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedFlight, formData]
  );

  // Delete logic
  const handleDeleteClick = useCallback((flight: Flight) => {
    setFlightToDelete(flight);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!flightToDelete?.id) {
      toast.error("Invalid flight selected");
      setIsDeleteModalOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFlight(flightToDelete.id);

      // Remove the deleted flight from both lists
      const removeFromList = (list: Flight[]) =>
        list.filter((f) => f.id !== flightToDelete.id);

      setFlights(removeFromList);
      setOriginalFlights(removeFromList);

      toast.success("Flight deleted successfully");
      setIsDeleteModalOpen(false);
      setFlightToDelete(null);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete flight";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [flightToDelete]);

  const cancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setFlightToDelete(null);
  }, []);

  // Table columns
  const columns: ColumnDef<Flight>[] = useMemo(
    () => [
      { header: "#", cell: ({ row }) => row.index + 1 },
      { accessorKey: "airLine", header: "Airline" },
      {
        header: "Economy Price (₹)",
        cell: ({ row }) => row.original.price?.economy ?? "-",
      },
      {
        header: "Premium Price (₹)",
        cell: ({ row }) => row.original.price?.premium ?? "-",
      },
      {
        header: "Business Price (₹)",
        cell: ({ row }) => row.original.price?.business ?? "-",
      },

      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              title="Edit flight"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              title="Delete flight"
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDeleteClick]
  );

  // Loading UI
  if (loading && flights.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading flights...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">Flights List</h2>
        <div className="w-full sm:w-60">
          <SearchBar placeholder="Search by Airline..." onSearch={handleSearch} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-800 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {flights.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ReusableTable data={flights} columns={columns} />
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-300 text-6xl mb-4">✈️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Flights Found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No flights match your search for "${searchQuery}"`
              : "No flights available at the moment"}
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedFlight && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Edit Flight</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isUpdating}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airline Name *
                </label>
                <input
                  type="text"
                  placeholder="Airline"
                  value={formData.airLine}
                  onChange={(e) =>
                    setFormData({ ...formData, airLine: e.target.value })
                  }
                  required
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Economy Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="Economy Price"
                  value={formData.economy}
                  onChange={(e) =>
                    setFormData({ ...formData, economy: Number(e.target.value) })
                  }
                  required
                  min="0"
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premium Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Premium Price (Optional)"
                  value={formData.premium}
                  onChange={(e) =>
                    setFormData({ ...formData, premium: Number(e.target.value) })
                  }
                  min="0"
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Business Price (Optional)"
                  value={formData.business}
                  onChange={(e) =>
                    setFormData({ ...formData, business: Number(e.target.value) })
                  }
                  min="0"
                  disabled={isUpdating}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && flightToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 text-center relative">
            <button
              onClick={cancelDelete}
              disabled={isDeleting}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
            <div className="mb-4 text-red-600 text-4xl">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this flight?
            </p>
            <p className="font-semibold text-gray-900">{flightToDelete.airLine}</p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isDeleting ? "Deleting..." : "Delete Flight"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightsPage;