import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addFlight } from "@/services/Flight/FlightService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  flightSchema,
  type FlightFormData,
} from "@/Types/vendor/Package/flight";
import type { Flight } from "@/interface/flightInterface";

const CreateFlight: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      date: "",
      fromLocation: "",
      toLocation: "",
      airLine: "",
      price: 0,
    },
  });

  const notifySuccess = () => toast.success("Flight added successfully!");
  const notifyError = (msg: string) => toast.error(msg);

  const onSubmit = async (data: FlightFormData) => {
    try {
      setLoading(true);
      const formattedData: Flight = {
        ...data,
        date: new Date(data.date),
        price: Number(data.price),
      };
      await addFlight(formattedData);
      notifySuccess();
      reset();
    } catch (error) {
      console.error("Error creating flight:", error);
      notifyError("Failed to create flight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create Flight</h2>
          <p className="text-sm text-gray-300 mt-1">
            Add a new flight to the system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Date */}
          <div>
            <Label htmlFor="date">
              Flight Date <span className="text-red-500">*</span>
            </Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* From Location */}
          <div>
            <Label htmlFor="fromLocation">
              From <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fromLocation"
              placeholder="Enter departure location"
              {...register("fromLocation")}
            />
            {errors.fromLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fromLocation.message}
              </p>
            )}
          </div>

          {/* To Location */}
          <div>
            <Label htmlFor="toLocation">
              To <span className="text-red-500">*</span>
            </Label>
            <Input
              id="toLocation"
              placeholder="Enter destination location"
              {...register("toLocation")}
            />
            {errors.toLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.toLocation.message}
              </p>
            )}
          </div>

          {/* Airline */}
          <div>
            <Label htmlFor="airLine">
              Airline <span className="text-red-500">*</span>
            </Label>
            <Input
              id="airLine"
              placeholder="Enter airline name"
              {...register("airLine")}
            />
            {errors.airLine && (
              <p className="text-red-500 text-sm mt-1">
                {errors.airLine.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">
              Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter ticket price"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Flight"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateFlight;
