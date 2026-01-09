/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { X } from "lucide-react";

import {
  addSubscriptionStart,
  addSubscriptionSuccess,
  addSubscriptionFailure,
} from "@/store/slice/Subscription/subscription";

import * as subscriptionService from "@/services/subscription/subscriptionservice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  SubscriptionSchema,
  type SubscriptionFormData,
} from "@/Types/Admin/Subscription/subscrriptionSchema";

export default function AddSubscriptionForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.subscription);
  const loading = status === "loading";

  const [features, setFeatures] = useState<string>("");
  const [currentFeature, setCurrentFeature] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(SubscriptionSchema),
  } as any);

  const notify = () => toast.success("Subscription added successfully!");

  const addFeature = () => {
    if (currentFeature.trim()) {
      const newFeatures = features ? `${features}, ${currentFeature.trim()}` : currentFeature.trim();
      setFeatures(newFeatures);
      setValue("features" as any, newFeatures);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const featuresArray = features.split(", ").filter(f => f.trim());
    const newFeatures = featuresArray.filter((_, i) => i !== index).join(", ");
    setFeatures(newFeatures);
    setValue("features" as any, newFeatures);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      dispatch(addSubscriptionStart());

      const response = await subscriptionService.addSubscription({
        name: data.name,
        price: data.price,
        duration: data.duration,
        stripePriceId: "",
        features: features.split(", ").map(f => f.trim()).filter(Boolean),
      });

      dispatch(addSubscriptionSuccess(response));
      notify();
      reset();
      setFeatures("");
      setCurrentFeature("");
    } catch {
      dispatch(addSubscriptionFailure("Failed to add subscription"));
      toast.error("Failed to add subscription");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center overflow-hidden p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col max-h-[95vh]">

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-8 py-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Add Subscription Plan</h2>
          </div>
          <p className="text-sm text-gray-300 ml-13">
            Create a new subscription plan with custom features and pricing
          </p>
        </div>

        {/* Form with enhanced styling */}
        <div className="p-8 space-y-5 bg-white flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          <ToastContainer position="top-right" autoClose={3000} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                Plan Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Premium Plan"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {errors.name && (
                <p className="text-red-600 text-sm flex items-center gap-1.5 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                Duration (Days)
              </Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
                placeholder="30"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {errors.duration && (
                <p className="text-red-600 text-sm flex items-center gap-1.5 mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              Price
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="999"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm flex items-center gap-1.5 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label htmlFor="features" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              Features
            </Label>
            
            {/* Feature Input */}
            <div className="flex gap-2">
              <Input
                id="features"
                type="text"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a feature and press Enter"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              <Button
                type="button"
                onClick={addFeature}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold"
              >
                Add
              </Button>
            </div>

            {/* Feature Tags Display */}
            {features && (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 min-h-[60px]">
                {features.split(", ").map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!features && (
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500">No features added yet. Start adding features above.</p>
              </div>
            )}

            {errors.features && (
              <p className="text-red-600 text-sm flex items-center gap-1.5 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.features.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Submit Button */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 rounded-b-3xl flex-shrink-0">
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Plan...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Subscription Plan
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center mt-3">
            All fields are required • Features can be added one at a time
          </p>
        </div>
      </div>
    </div>
  );
}