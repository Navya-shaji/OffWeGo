import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toast, ToastContainer } from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
import * as subscriptionService from "@/services/subscription/subscriptionservice";
import type { Subscription } from "@/interface/subscription";
import {
  getSubscriptionsStart,
  getSubscriptionsSuccess,
  getSubscriptionsFailure,
  deleteSubscriptionStart,
  deleteSubscriptionSuccess,
  deleteSubscriptionFailure,
} from "@/store/slice/Subscription/subscription";
import { ConfirmModal } from "@/components/Modular/ConfirmModal";
import EditSubscriptionModal from "@/components/subscription/EditSubscription";

export default function SubscriptionList() {
  const dispatch = useAppDispatch();
  const { subscriptions, status, error } = useAppSelector(
    (state) => state.subscription
  );
  const loading = status === "loading";

  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      dispatch(getSubscriptionsStart());
      const data = await subscriptionService.getSubscriptions();
      dispatch(getSubscriptionsSuccess(data));
    } catch (err: unknown) {
      dispatch(getSubscriptionsFailure("Failed to fetch subscriptions"));
      toast.error("Failed to fetch subscriptions");
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleDelete = (subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!subscriptionToDelete?._id) return;
    try {
      dispatch(deleteSubscriptionStart());
      await subscriptionService.deleteSubscription(subscriptionToDelete._id);
      dispatch(deleteSubscriptionSuccess(subscriptionToDelete._id));
      toast.success("Subscription deleted successfully!");
      setIsDeleteModalOpen(false);
      setSubscriptionToDelete(null);
      fetchSubscriptions();
    } catch {
      dispatch(deleteSubscriptionFailure("Failed to delete subscription"));
      toast.error("Failed to delete subscription");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-black text-white px-4 py-3">
          <h2 className="text-2xl font-bold">Subscription Plans</h2>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-600">
            Loading subscriptions...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && subscriptions.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No subscriptions found
          </div>
        )}

        {!loading && subscriptions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Max Packages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {subscription.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      ₹{subscription.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {subscription.duration} days
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {subscription.maxPackages}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(subscription)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(subscription)}
                          className="text-red-600 hover:text-red-800 transition"
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

      {editingSubscription && (
        <EditSubscriptionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingSubscription(null);
          }}
          subscription={editingSubscription}
          onUpdated={fetchSubscriptions}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Subscription"
        message={`Are you sure you want to delete "${subscriptionToDelete?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSubscriptionToDelete(null);
        }}
      />
    </div>
  );
}
