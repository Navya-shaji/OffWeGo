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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Subscription>({
    defaultValues: {
      name: subscription.name,
      price: subscription.price,
      duration: subscription.duration,
      maxPackages: subscription.maxPackages,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: Subscription) => {
    try {
      dispatch(updateSubscriptionStart());
      await subscriptionService.updateSubscription(subscription.id, data);
      dispatch(updateSubscriptionSuccess(data));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between bg-black text-white px-6 py-4 rounded-t-lg">
          <h3 className="text-xl font-bold">Edit Subscription</h3>
          <button onClick={onClose} className="hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Duration (Days)
            </label>
            <input
              type="number"
              {...register("duration", { required: "Duration is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Max Packages
            </label>
            <input
              type="number"
              {...register("maxPackages", {
                required: "Max packages is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.maxPackages && (
              <p className="text-red-500 text-sm">
                {errors.maxPackages.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
