import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, Trash } from "lucide-react";
import { getAllHotel, updateHotel, deleteHotel } from "@/services/Hotel/HotelService";

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
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({ name: "", address: "", rating: 0 });

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await getAllHotel();
      const hotelData = response?.data?.data || [];
      setHotels(Array.isArray(hotelData) ? hotelData : []);
    } catch (error) {
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      rating: hotel.rating,
    });
    setIsEditModalOpen(true);
  };

const handleUpdate = async () => {
  if (!selectedHotel?._id) return toast.error("Invalid ID");

  try {
    console.log("Updating hotel with ID:", selectedHotel._id, formData);
    const res = await updateHotel(selectedHotel._id, formData);
    console.log("Update response:", res.data);

    setHotels(prev =>
      prev.map(h =>
        h._id === selectedHotel._id ? { ...h, ...formData } : h
      )
    );

    toast.success("Hotel updated successfully");
    setIsEditModalOpen(false);
  } catch (err) {
    console.error("Update error:", err);
    toast.error("Failed to update hotel");
  }
};

const handleDelete = async (_id?: string) => {
  if (!_id) return toast.error("Invalid ID");
  if (!window.confirm("Delete this hotel?")) return;

  try {
    await deleteHotel(_id);
   

    setHotels(prev => prev.filter(h => h._id !== _id));

    toast.success("Hotel deleted successfully");
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Failed to delete hotel");
  }
};

  const columns: ColumnDef<Hotel>[] = [
    { accessorKey: "name", header: "Hotel Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "rating", header: "Rating", cell: ({ row }) => `${row.original.rating} ⭐` },
    {
      header: "Actions",
      cell: ({ row }) => {
        const hotel = row.original;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(hotel)}
              className="p-2 hover:bg-blue-50 rounded-lg"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(hotel._id)}
              className="p-2 hover:bg-red-50 rounded-lg"
            >
              <Trash size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4">Hotels List</h2>

      {loading ? <p>Loading hotels...</p> : <ReusableTable data={hotels} columns={columns} />}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Hotel</h3>
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
           
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsTable;
