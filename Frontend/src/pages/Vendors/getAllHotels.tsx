import { useState, useEffect, useMemo, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, MapPin } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllHotel,
  updateHotel,
  deleteHotel,
  searchHotel,
} from "@/services/Hotel/HotelService";

import { SearchBar } from "@/components/Modular/searchbar";
import Pagination from "@/components/pagination/pagination";
import ReusableTable from "@/components/Modular/Table";

interface Hotel {
  _id: string;
  name: string;
  address: string;
  rating: number;
  hotelId?: string;
  destinationId?: string;
}

const HotelsTable: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    rating: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadHotels = useCallback(async () => {
    try {
      const response = await getAllHotel(page, 5);

      const hotelsWithId = response.hotels.map((hotel: any) => ({
        ...hotel,
        _id: hotel.hotelId,
      }));

      setHotels(hotelsWithId || []);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load hotels");
    }
  }, [page]);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  const handleEditClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      rating: hotel.rating,
    });
    setIsEditModalOpen(true);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      await loadHotels();
      return;
    }
    try {
      const response = await searchHotel(query);
      setHotels(response ?? []);
      setTotalPages(1);
    } catch (err) {
      console.error(err);
      setHotels([]);
      toast.error("Failed to search hotels");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel?._id) return;

    try {
      await updateHotel(selectedHotel._id, {
        name: formData.name,
        address: formData.address,
        rating: Math.min(5, formData.rating), // ✅ rating capped at 5
      });
      toast.success("Hotel updated successfully!");

      setHotels((prev) =>
        prev.map((h) =>
          h._id === selectedHotel._id
            ? {
                ...h,
                name: formData.name,
                address: formData.address,
                rating: Math.min(5, formData.rating),
              }
            : h
        )
      );

      setIsEditModalOpen(false);
      setSelectedHotel(null);
    } catch (err: any) {
      console.error("Error while editing hotel", err);
      toast.error(err.message || "Failed to update hotel");
    }
  };

  const confirmDelete = async () => {
    if (!selectedHotel?._id) return;
    try {
      await deleteHotel(selectedHotel._id);
      toast.success("Hotel deleted successfully!");
      await loadHotels();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete hotel");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedHotel(null);
    }
  };

  const columns = useMemo<ColumnDef<Hotel>[]>(
    () => [
      { header: "Hotel Name", accessorKey: "name" },
      { header: "Address", accessorKey: "address" },
      {
        header: "Rating",
        cell: ({ row }) => `${row.original.rating} ⭐`,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="p-2 hover:bg-blue-100 rounded-md transition-colors flex gap-2">
            <button
              type="button"
              onClick={() => handleEditClick(row.original)}
              className="text-black hover:text-black"
            >
              <Edit className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedHotel(row.original);
                setIsDeleteModalOpen(true);
              }}
              className="text-black hover:text-black"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Hotels List
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-60">
            <SearchBar placeholder="Search hotels..." onSearch={handleSearch} />
          </div>
          <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm">
            {hotels.length} hotels
          </span>
        </div>
      </div>

      <ReusableTable data={hotels} columns={columns} />

      {/* ✅ Edit Modal */}
      {isEditModalOpen && selectedHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 p-6 animate-scaleIn">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Edit Hotel
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Hotel Name"
              />
              <input
                className="border p-2 w-full rounded"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
              />
              <input
                className="border p-2 w-full rounded"
                type="number"
                min={1}
                max={5} // ✅ input validation
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: Math.min(5, Number(e.target.value)),
                  })
                }
                placeholder="Rating (1-5)"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Delete Modal */}
      {isDeleteModalOpen && selectedHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 p-6 animate-scaleIn">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedHotel.name}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Pagination total={totalPages} current={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default HotelsTable;
