import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { createActivity } from "@/services/Activity/ActivityService";
import {
  ActivitySchema,
  type ActivityFormData,
} from "@/Types/vendor/Package/Activity";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { getCoordinatesFromPlace } from "@/services/Location/locationService";
import { MapPin, Loader2 } from "lucide-react";

const AddActivity: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [destinationId, setDestinationId] = useState<string>("");
  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false);
  const [locationInput, setLocationInput] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: { title: "", description: "", imageUrl: null, coordinates: { lat: undefined, lng: undefined } },
  });

  const notifySuccess = () => toast.success("Activity added successfully!");
  const notifyError = (msg: string) => toast.error(msg);

  const handleGetCoordinates = async () => {
    if (!locationInput || locationInput.trim().length < 3) {
      toast.error("Please enter a location first");
      return;
    }

    setIsGettingCoordinates(true);
    try {
      const coords = await getCoordinatesFromPlace(locationInput);
      setValue("coordinates.lat", parseFloat(coords.lat.toFixed(6)));
      setValue("coordinates.lng", parseFloat(coords.lng.toFixed(6)));
      toast.success("Coordinates fetched successfully!");
    } catch (error: any) {
      console.error("Error fetching coordinates:", error);
      toast.error(error?.message || "Failed to fetch coordinates");
    } finally {
      setIsGettingCoordinates(false);
    }
  };

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const res = await fetchAllDestinations(1, 50); // adjust pagination
        setDestinations(res.destinations);
      } catch (err) {
        console.error("Failed to load destinations:", err);
        notifyError("Failed to load destinations");
      }
    };
    loadDestinations();
  }, []);
const onSubmit = async (data: ActivityFormData) => {
  if (!destinationId) {
    notifyError("Please select a destination");
    return;
  }

  const fileInput = (data.imageUrl as unknown) as FileList;
  if (!fileInput || fileInput.length === 0) {
    notifyError("Please select an image");
    return;
  }

  const file = fileInput[0]; 
  let imageUrl = "";

  try {
    setLoading(true);
    imageUrl = await uploadToCloudinary(file); 
    await createActivity({ ...data, imageUrl }, destinationId);

    notifySuccess();
    reset();
    setDestinationId("");
  } catch (err) {
    console.error("Error creating activity:", err);
    notifyError(err instanceof Error ? err.message : String(err));
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Add Activity</h2>
          <p className="text-sm text-gray-300 mt-1">
            Add a new activity to a specific destination
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <Label htmlFor="destination">
              Select Destination <span className="text-red-500">*</span>
            </Label>
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

          <div>
            <Label htmlFor="title">
              Activity Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter activity title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="imageUrl">
              Activity Image <span className="text-red-500">*</span>
            </Label>
            <Input type="file" id="imageUrl" {...register("imageUrl")} />
            {errors.imageUrl?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageUrl.message as string}
              </p>
            )}
          </div>

          {/* Location for Coordinates */}
          <div>
            <Label htmlFor="location">
              Location (for coordinates) <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="location"
                placeholder="Enter activity location/address"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleGetCoordinates}
                disabled={isGettingCoordinates}
                className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {isGettingCoordinates ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Getting...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Get Coords</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the location/address to automatically fetch coordinates
            </p>
          </div>

          {/* Coordinates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <Label className="text-base font-semibold">Geographic Coordinates</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="e.g., 28.6139"
                  {...register("coordinates.lat", { valueAsNumber: true })}
                />
                {errors.coordinates?.lat && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.coordinates.lat.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="e.g., 77.2090"
                  {...register("coordinates.lng", { valueAsNumber: true })}
                />
                {errors.coordinates?.lng && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.coordinates.lng.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Click "Get Coords" to automatically fetch coordinates from the location
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Activity"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddActivity;
