import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hotelSchema, type HotelFormData } from "@/Types/vendor/Package/Hotel";
import { createHotel } from "@/services/Hotel/HotelService";
import { fetchAllDestinations } from "@/services/Destination/destinationService"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star } from "lucide-react";
import type { DestinationInterface } from "@/interface/destinationInterface";
import type { Hotel } from "@/interface/PackageInterface";

const CreateHotel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [destinationId, setDestinationId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: { name: "", address: "", rating: 0 },
  });

  const rating = watch("rating");

  const notifySuccess = () => toast.success("Hotel added successfully!");
  const notifyError = (msg: string) => toast.error(msg);

  const handleRatingClick = (value: number) => {
    setValue("rating", value);
  };

  
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const res = await fetchAllDestinations(1, 50); 
        setDestinations(res.destinations);
      } catch (error) {
        console.error("Failed to load destinations:", error);
        notifyError("Failed to load destinations");
      }
    };
    loadDestinations();
  }, []);

const onSubmit = async (data: HotelFormData) => {
  if (!destinationId) {
    notifyError("Please select a destination");
    return;
  }

  const hotelData: Hotel = { ...data, destinationId }; 

  try {
    setLoading(true);
    await createHotel(hotelData, destinationId); 
    notifySuccess();
    reset();
    setDestinationId("");
  } catch (error) {
    console.error("Error creating hotel:", error);
    notifyError("Failed to create hotel");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create Hotel</h2>
          <p className="text-sm text-gray-300 mt-1">
            Add a new hotel to a specific destination
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <Label htmlFor="destination">Select Destination <span className="text-red-500">*</span></Label>
            <select
              id="destination"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              <option value="">-- Select Destination --</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hotel Name */}
          <div>
            <Label htmlFor="name">Hotel Name <span className="text-red-500">*</span></Label>
            <Input id="name" placeholder="Enter hotel name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
            <Input id="address" placeholder="Enter hotel address" {...register("address")} />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <Label>Rating <span className="text-red-500">*</span></Label>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Hotel"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateHotel;
