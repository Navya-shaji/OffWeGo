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

const AddActivity: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [destinationId, setDestinationId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: { title: "", description: "", imageUrl: null },
  });

  const notifySuccess = () => toast.success("Activity added successfully!");
  const notifyError = (msg: string) => toast.error(msg);

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
