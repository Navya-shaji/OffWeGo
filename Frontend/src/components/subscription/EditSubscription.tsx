import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import * as subscriptionService from "@/services/subscription/subscriptionservice";
import { useAppDispatch } from "@/hooks";
import {
  updateSubscriptionStart,
  updateSubscriptionSuccess,
  updateSubscriptionFailure,
} from "@/store/slice/Subscription/subscription";
import type { Subscription } from "@/interface/subscription";

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onUpdated: () => void;
}

export default function EditSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onUpdated,
}: EditSubscriptionModalProps) {
  const dispatch = useAppDispatch();
  const [features, setFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Subscription>({
    defaultValues: {
      name: subscription.name,
      price: subscription.price,
      duration: subscription.duration,
      features: subscription.features,
      isActive: subscription.isActive,
    },
  });

  useEffect(() => {
    if (subscription.features && Array.isArray(subscription.features)) {
      setFeatures(subscription.features);
    }
  }, [subscription]);

  if (!isOpen) return null;

  const addFeature = () => {
    if (currentFeature.trim()) {
      const newFeatures = [...features, currentFeature.trim()];
      setFeatures(newFeatures);
      setValue("features", newFeatures as any);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    setValue("features", newFeatures as any);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const onSubmit = async (data: Subscription) => {
    try {
      dispatch(updateSubscriptionStart());
      const updateData = {
        ...data,
        features: features,
      };
      await subscriptionService.updateSubscription(subscription._id, updateData);
      dispatch(updateSubscriptionSuccess(updateData));
      toast.success("Subscription updated successfully!");
      onClose();
      reset();
      onUpdated();
    } catch (err) {
      dispatch(updateSubscriptionFailure("Failed to update subscription"));
      toast.error("Failed to update subscription");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-8 py-6 rounded-t-3xl flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold">Edit Subscription</h3>
            <p className="text-sm text-gray-300 mt-1">Update subscription plan details</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="p-8 space-y-5 overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                Plan Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Premium Plan"
              />
              {errors.name && (
                <p className="text-red-600 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                Duration (Days)
              </label>
              <input
                type="number"
                {...register("duration", { required: "Duration is required", valueAsNumber: true })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="30"
              />
              {errors.duration && (
                <p className="text-red-600 text-sm flex items-center gap-1.5">
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
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
              <input
                type="number"
                {...register("price", { required: "Price is required", valueAsNumber: true })}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="999"
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              Status
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="sr-only peer"
                  defaultChecked={subscription.isActive}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {subscription.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              Features
            </label>
            
            {/* Feature Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a feature and press Enter"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold hover:scale-105 active:scale-95"
              >
                Add
              </button>
            </div>

            {/* Feature Tags Display */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 min-h-[60px]">
                {features.map((feature, index) => (
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

            {features.length === 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500">No features added yet. Start adding features above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 rounded-b-3xl flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-xl hover:shadow-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Update Subscription
          </button>
        </div>
      </div>
    </div>
  );
}