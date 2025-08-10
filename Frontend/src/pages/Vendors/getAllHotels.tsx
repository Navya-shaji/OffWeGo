import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/Modular/Table"; 
import type { ColumnDef } from "@tanstack/react-table"; 
import { Button } from "@/components/ui/button";
import { getAllHotel } from "@/services/Hotel/HotelService"; 
import { toast } from "react-toastify";

interface Hotel {
  hotelId: string;
  name: string;
  address: string;
  rating: number;
  destinationId: string;
}

const HotelsTable: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

 const fetchHotels = async () => {
  try {
    setLoading(true);
    const response = await getAllHotel();
    console.log("Hotels API Response:", response.data);
    
    const hotelData = response.data.data || response.data || [];
    setHotels(hotelData);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    toast.error("Failed to load hotels");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchHotels();
  }, []);



  const columns: ColumnDef<Hotel>[] = [
    {
      accessorKey: "name",
      header: "Hotel Name",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => `${row.original.rating} ⭐`,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Edit hotel: ${row.original.hotelId}`)}
          >
            Edit
          </Button>
          {/* <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.hotelId)}
          >
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Hotels List</h2>
      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <ReusableTable data={hotels} columns={columns} />
      )}
    </div>
  );
};

export default HotelsTable;
