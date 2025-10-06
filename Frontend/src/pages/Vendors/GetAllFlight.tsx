import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    date: "",
    airLine: "",
    price: 0,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<Flight | null>(null);

  const loadFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchAllFlights();
      setFlights(response || []);
      setOriginalFlights(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load flights");
      toast.error("Failed to load flights");
    } finally {
      setLoading(false);
    }
  }, []);


  console.log("allFlights",flights)
  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  // Search flights
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setIsSearchMode(false);
        setFlights(originalFlights);
        return;
      }

      setIsSearchMode(true);
      const filtered = originalFlights.filter(
        (f) =>
          f.fromLocation.toLowerCase().includes(query.toLowerCase()) ||
          f.toLocation.toLowerCase().includes(query.toLowerCase()) ||
          f.airLine.toLowerCase().includes(query.toLowerCase())
      );
      setFlights(filtered);
    },
    [originalFlights]
  );

  const handleEdit = useCallback((flight: Flight) => {
    setSelectedFlight(flight);
    setFormData({
      fromLocation: flight.fromLocation,
      toLocation: flight.toLocation,
      airLine: flight.airLine,
      price: flight.price,
      date:
        flight.date instanceof Date
          ? flight.date.toISOString().split("T")[0]
          : flight.date,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFlight?.id) {
        toast.error("Invalid flight selected");
        return;
      }

      setIsUpdating(true);
      try {
        const updateData = {
          ...formData,
          date: formData.date ? new Date(formData.date) : new Date(),
        };

        const updatedFlight = await updateFlight(selectedFlight.id, updateData);
        const updatedList = flights.map((f) =>
          f.id === selectedFlight.id ? updatedFlight : f
        );
        setFlights(updatedList);
        if (!isSearchMode) setOriginalFlights(updatedList);
        toast.success("Flight updated successfully");
        setIsEditModalOpen(false);
        setSelectedFlight(null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update flight");
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedFlight, formData, flights, isSearchMode]
  );

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

    try {
      await deleteFlight(flightToDelete.id);
      const updatedList = flights.filter((f) => f.id !== flightToDelete.id);
      setFlights(updatedList);
      if (!isSearchMode) setOriginalFlights(updatedList);
      toast.success("Flight deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete flight");
    } finally {
      setIsDeleteModalOpen(false);
      setFlightToDelete(null);
    }
  }, [flightToDelete, flights, isSearchMode]);

  const columns: ColumnDef<Flight>[] = useMemo(
    () => [
      { header: "#", cell: ({ row }) => row.index + 1 },
      { accessorKey: "fromLocation", header: "From" },
      { accessorKey: "toLocation", header: "To" },
      { accessorKey: "airLine", header: "Airline" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "price", header: "Price" },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              title="Edit flight"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              title="Delete flight"
            >
              <Trash size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDeleteClick]
  );

  // Loading state
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
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">Flights List</h2>
        <div className="w-full sm:w-60">
          <SearchBar placeholder="Search Flights..." onSearch={handleSearch} />
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
              <input
                type="text"
                placeholder="From Location"
                value={formData.fromLocation}
                onChange={(e) =>
                  setFormData({ ...formData, fromLocation: e.target.value })
                }
                required
                disabled={isUpdating}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="To Location"
                value={formData.toLocation}
                onChange={(e) =>
                  setFormData({ ...formData, toLocation: e.target.value })
                }
                required
                disabled={isUpdating}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Airline"
                value={formData.airLine}
                onChange={(e) =>
                  setFormData({ ...formData, airLine: e.target.value })
                }
                required
                disabled={isUpdating}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                disabled={isUpdating}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                disabled={isUpdating}
                className="w-full border rounded px-3 py-2"
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
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
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 text-center">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <div className="mb-4 text-red-600 text-4xl">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this flight?
            </p>
            <p className="font-semibold">
              {flightToDelete.fromLocation} → {flightToDelete.toLocation}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 rounded text-white hover:bg-red-600"
              >
                Delete Flight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightsPage;
