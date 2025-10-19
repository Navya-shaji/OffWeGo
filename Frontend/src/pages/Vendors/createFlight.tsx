import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addFlight } from "@/services/Flight/FlightService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
      airLine: "",
      price: {
        economy: 0,
        premium: 0,
        business: 0,
      },
    },
  });

  const notifySuccess = () => toast.success("Flight added successfully!");
  const notifyError = (msg: string) => toast.error(msg);

  const onSubmit = async (data: FlightFormData) => {
    try {
      setLoading(true);
      const formattedData: Flight = {
        airLine: data.airLine,
        price: {
          economy: Number(data.price.economy),
          premium: data.price.premium ? Number(data.price.premium) : undefined,
          business: data.price.business
            ? Number(data.price.business)
            : undefined,
        },
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
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
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

          {/* Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price.economy">
                Economy Price (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price.economy"
                type="number"
                placeholder="Economy"
                {...register("price.economy", { valueAsNumber: true })}
              />
              {errors.price?.economy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.economy.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price.premium">Premium Price (₹)</Label>
              <Input
                id="price.premium"
                type="number"
                placeholder="Premium"
                {...register("price.premium", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="price.business">Business Price (₹)</Label>
              <Input
                id="price.business"
                type="number"
                placeholder="Business"
                {...register("price.business", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Submit Button */}
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
