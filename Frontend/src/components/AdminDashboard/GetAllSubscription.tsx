import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toast, ToastContainer } from "react-toastify";
import { Pencil, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as subscriptionService from "@/services/subscription/subscriptionservice";
import type { Subscription } from "@/interface/subscription";
import {
  getSubscriptionsStart,
  getSubscriptionsSuccess,
  getSubscriptionsFailure,
  updateSubscriptionStart,
  updateSubscriptionSuccess,
  updateSubscriptionFailure,
  deleteSubscriptionStart,
  deleteSubscriptionSuccess,
  deleteSubscriptionFailure,
} from "@/store/slice/Subscription/subscription";

export default function SubscriptionList() {
  const dispatch = useAppDispatch();
  const { subscriptions, status, error } = useAppSelector((state) => state.subscription);
  const loading = status === "loading";

  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Subscription>();

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      dispatch(getSubscriptionsStart());
      const data = await subscriptionService.getSubscriptions();
      dispatch(getSubscriptionsSuccess(data));
    } catch (err: unknown) {
      console.error("Error fetching subscriptions:", err);
      dispatch(getSubscriptionsFailure("Failed to fetch subscriptions"));
      toast.error("Failed to fetch subscriptions");
    }
  };

  
  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setValue("name", subscription.name);
    setValue("price", subscription.price);
    setValue("duration", subscription.duration);
    setValue("maxPackages", subscription.maxPackages);
    setIsEditModalOpen(true);
  };


  const onEditSubmit = async (data: Subscription) => {
    if (!editingSubscription?._id) return;

    try {
      dispatch(updateSubscriptionStart());
      const response = await subscriptionService.updateSubscription(
        editingSubscription._id,
        data
      );
      dispatch(updateSubscriptionSuccess(response));
      toast.success("Subscription updated successfully!");
      setIsEditModalOpen(false);
      reset();
      setEditingSubscription(null);
      fetchSubscriptions(); // Refresh the list
    } catch (err: unknown) {
      console.error("Error updating subscription:", err);
      dispatch(updateSubscriptionFailure("Failed to update subscription"));
      toast.error("Failed to update subscription");
    }
  };

  // Handle Delete
  const handleDelete = (subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!subscriptionToDelete?._id) return;

    try {
      dispatch(deleteSubscriptionStart());
      await subscriptionService.deleteSubscription(subscriptionToDelete._id);
      dispatch(deleteSubscriptionSuccess(subscriptionToDelete._id));
      toast.success("Subscription deleted successfully!");
      setIsDeleteModalOpen(false);
      setSubscriptionToDelete(null);
      fetchSubscriptions(); // Refresh the list
    } catch (err: unknown) {
      console.error("Error deleting subscription:", err);
      dispatch(deleteSubscriptionFailure("Failed to delete subscription"));
      toast.error("Failed to delete subscription");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-black text-white px-6 py-4">
          <h2 className="text-2xl font-bold">Subscription Plans</h2>
          <p className="text-sm text-gray-300 mt-1">Manage your subscription plans</p>
        </div>

        {loading && (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading subscriptions...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && subscriptions.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-600">No subscriptions found</p>
          </div>
        )}

        {!loading && !error && subscriptions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Packages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscription.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{subscription.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.duration} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.maxPackages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(subscription)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          disabled={loading}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subscription)}
                          className="text-red-600 hover:text-red-800 transition"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between bg-black text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-bold">Edit Subscription</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  reset();
                }}
                className="text-white hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Premium Plan"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="999"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  {...register("duration", {
                    required: "Duration is required",
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
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
                    valueAsNumber: true,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
                {errors.maxPackages && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxPackages.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onEditSubmit)}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Subscription</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{subscriptionToDelete?.name}</span>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSubscriptionToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}