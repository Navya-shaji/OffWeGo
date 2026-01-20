import { useEffect, useState, useCallback } from "react";
import {
  getVendorsByStatus,
  updateVendorStatus,
} from "@/services/admin/adminService";
import toast from "react-hot-toast";
import type { Vendor } from "@/interface/vendorInterface";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Props {
  filter: "pending" | "approved" | "rejected";
  onTabChange?: (tab: string) => void;
}

const VendorRequests: React.FC<Props> = ({ filter, onTabChange }) => {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [displayedVendors, setDisplayedVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingRejectVendorId, setPendingRejectVendorId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 9;

  const fetchVendors = () => {
    setLoading(true);
    getVendorsByStatus(filter)
      .then((data) => {
        // Sort by createdAt descending (newest first)
        const sortedData = [...data].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setAllVendors(sortedData);
        // Reset pagination
        setPage(1);
        setDisplayedVendors(sortedData.slice(0, ITEMS_PER_PAGE));
        setHasMore(sortedData.length > ITEMS_PER_PAGE);
      })
      .catch(() => toast.error("Failed to fetch vendors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Load more vendors from local sorted array
  const loadMoreVendors = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    // Simulate finding next batch
    setTimeout(() => {
      const nextEndIndex = (page + 1) * ITEMS_PER_PAGE;
      const nextBatch = allVendors.slice(0, nextEndIndex);

      setDisplayedVendors(nextBatch);
      setPage(prev => prev + 1);
      setHasMore(allVendors.length > nextEndIndex);
      setLoadingMore(false);
    }, 500);
  }, [allVendors, page, loadingMore, hasMore]);


  const handleStatusChange = async (
    vendorId: string,
    newStatus: "approved" | "rejected",
    reason?: string
  ) => {
    try {
      await updateVendorStatus(vendorId, newStatus, reason);
      toast.success(`Vendor ${newStatus}`);
      if (newStatus === "approved" && onTabChange) {
        onTabChange("Approved Requests");
      } else {
        // Update both allVendors and displayedVendors
        setAllVendors((prev) => prev.filter((ven) => (ven._id || ven.id) !== vendorId));
        setDisplayedVendors((prev) => prev.filter((ven) => (ven._id || ven.id) !== vendorId));
      }

      if (newStatus === "rejected") {
        setIsRejectModalOpen(false);
        setRejectionReason("");
        setPendingRejectVendorId(null);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openRejectModal = (vendorId: string) => {
    setPendingRejectVendorId(vendorId);
    setIsRejectModalOpen(true);
  };

  return (
    <div className="py-2">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" color="#3B82F6" />
        </div>
      ) : allVendors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg italic">
            No {filter} vendors found for your review.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayedVendors.map((vendor) => (
              <div
                key={vendor._id || vendor.id}
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="space-y-3 text-gray-700">
                  <p className="text-lg">
                    <span className="font-semibold">Name:</span> {vendor.name}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Email:</span> {vendor.email}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Phone:</span> {vendor.phone}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`capitalize font-semibold ${vendor.status === "approved"
                        ? "text-green-600"
                        : vendor.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {vendor.status}
                    </span>
                  </p>
                  {vendor.status === "rejected" && vendor.rejectionReason && (
                    <p className="text-sm text-red-500 italic">
                      <span className="font-semibold">Reason:</span> {vendor.rejectionReason}
                    </p>
                  )}
                  <p className="text-lg">
                    {vendor.documentUrl && (
                      <button
                        onClick={() => setSelectedDocument(vendor.documentUrl)}
                        className="bg-black text-white px-2 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
                      >
                        View Document
                      </button>
                    )}
                  </p>
                </div>

                {filter === "pending" && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleStatusChange(vendor._id || vendor.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(vendor._id || vendor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && displayedVendors.length > 0 && !loading && (
            <div className="py-12 px-4 text-center">
              <button
                onClick={loadMoreVendors}
                disabled={loadingMore}
                className={`group relative px-10 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${loadingMore ? "opacity-80 cursor-not-allowed" : ""
                  }`}
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                    <span>Fetching Vendors...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Vendors</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && displayedVendors.length > 0 && (
            <div className="p-8 text-center text-sm text-gray-500 italic">
              You've reached the end of the vendor list
            </div>
          )}
        </>
      )}

      {/* Reject Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Vendor Application</h3>
            <p className="text-gray-600 mb-4 text-sm">Please provide a reason for rejecting this application. This will be visible to the vendor.</p>

            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(pendingRejectVendorId!, "rejected", rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedDocument(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>
            <div className="p-4">
              <img
                src={selectedDocument}
                alt="Vendor Document"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRequests;

