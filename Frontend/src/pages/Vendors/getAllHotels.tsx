import { useState, useEffect, useMemo } from "react";
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
  hotelId?: string;
  name: string;
  address: string;
  rating: number;
  destinationId?: string;
}

const HotelsTable: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "", rating: 0 });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHotels();
  }, []);

const loadHotels = async () => {
  try {
    const response = await getAllHotel(page, 5); 
    console.log(response);
    
    setHotels(response.hotels); 

    const total = Number(response?.totalHotels || 0);
    setTotalPages(Math.ceil(total / 5));
  } catch (err) {
    console.error(err);
    toast.error("Failed to load hotels");
  }
};

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
      await updateHotel(selectedHotel._id, formData);
      toast.success("Hotel updated successfully!");
      setIsEditModalOpen(false);
      await loadHotels();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update hotel");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await deleteHotel(id);
      toast.success("Hotel deleted successfully!");
      setHotels((prev) => prev.filter((hotel) => hotel._id !== id)); // update state without reload
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete hotel");
    }
  };

  const columns = useMemo<ColumnDef<Hotel>[]>(() => [
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
            onClick={() => handleDelete(row.original._id)}
            className="text-black hover:text-black"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header Section */}
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

      {/* Table */}
      <ReusableTable data={hotels} columns={columns} />

      {/* Edit Modal */}
      {isEditModalOpen && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Hotel</h3>
            <form onSubmit={handleUpdate}>
              <input
                className="border p-2 w-full mb-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hotel Name"
              />
              <input
                className="border p-2 w-full mb-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
              />
              <input
                className="border p-2 w-full mb-4"
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                placeholder="Rating"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <Pagination total={totalPages} current={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default HotelsTable;
