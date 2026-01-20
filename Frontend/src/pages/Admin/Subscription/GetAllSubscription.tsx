import { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Package } from "lucide-react";
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

  const [displayedSubscriptions, setDisplayedSubscriptions] = useState<Subscription[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubscriptions = async () => {
    try {
      dispatch(getSubscriptionsStart());
      const response = await subscriptionService.getSubscriptions();
      const data = response?.data || response;
      const allSubscriptions = Array.isArray(data) ? data : [];
      dispatch(getSubscriptionsSuccess(allSubscriptions));

      setDisplayedSubscriptions(allSubscriptions.slice(0, ITEMS_PER_PAGE));
      setHasMore(allSubscriptions.length > ITEMS_PER_PAGE);
      setPage(1);
    } catch {
      dispatch(getSubscriptionsFailure("Failed to fetch subscriptions"));
      toast.error("Failed to fetch subscriptions");
    }
  };

  const loadMoreSubscriptions = useCallback(() => {
    if (loadingMore || !hasMore || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    // Simulate small delay for UX
    setTimeout(() => {
      const nextEndIndex = (page + 1) * ITEMS_PER_PAGE;
      const nextBatch = subscriptions.slice(0, nextEndIndex);

      setDisplayedSubscriptions(nextBatch);
      setPage(prev => prev + 1);
      setHasMore(subscriptions.length > nextEndIndex);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }, 300);
  }, [subscriptions, page, loadingMore, hasMore]);


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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-8 py-8 rounded-3xl shadow-2xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
              <p className="text-sm text-gray-300 mt-1">
                Manage and view all subscription plans
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {loading && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">Loading subscriptions...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 m-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
              <p className="text-red-700 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && subscriptions.length === 0 && (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium text-lg">No subscriptions found</p>
              <p className="text-gray-500 text-sm mt-2">Create your first subscription plan to get started</p>
            </div>
          )}

          {!loading && subscriptions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        Plan Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        Price
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        Duration
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        Features
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedSubscriptions.map((subscription, index) => (
                    <tr
                      key={subscription._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-gray-900">
                          {subscription.name}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg">
                          <span className="text-sm font-bold text-gray-900">₹{subscription.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">{subscription.duration}</span> days
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {subscription.features && subscription.features.length > 0 ? (
                            subscription.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200"
                              >
                                {feature}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">No features</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: subscription.isActive ? '#dcfce7' : '#fee2e2',
                            color: subscription.isActive ? '#166534' : '#991b1b'
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: subscription.isActive ? '#22c55e' : '#ef4444'
                            }}
                          ></span>
                          {subscription.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(subscription)}
                            className="p-2 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Edit subscription"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subscription)}
                            className="p-2 bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Delete subscription"
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

          {/* Load More Button */}
          {hasMore && displayedSubscriptions.length > 0 && !loading && (
            <div className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={loadMoreSubscriptions}
                disabled={loadingMore}
                className={`group relative px-10 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${loadingMore ? "opacity-80 cursor-not-allowed" : ""
                  }`}
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                    <span>Fetching Plans...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Plans</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && displayedSubscriptions.length > 0 && (
            <div className="p-8 text-center text-sm text-gray-500 bg-gray-50/30 border-t border-gray-100 italic">
              You've viewed all available subscription plans
            </div>
          )}

          {/* Footer Stats */}
          {!loading && subscriptions.length > 0 && (
            <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center font-medium">
                Showing <span className="text-gray-900 font-bold">{displayedSubscriptions.length}</span> of <span className="text-gray-900 font-bold">{subscriptions.length}</span> active plans
              </p>
            </div>
          )}
        </div>
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