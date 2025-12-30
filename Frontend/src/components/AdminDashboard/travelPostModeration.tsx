import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { TravelPost } from "@/interface/TravelPost";
import {
  getTravelPostsByStatus,
  updateTravelPostStatus,
} from "@/services/admin/adminService";

type Status = "PENDING" | "APPROVED" | "REJECTED";

const TravelPostModeration = () => {
  const [status, setStatus] = useState<Status>("PENDING");
  const [posts, setPosts] = useState<TravelPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectPostId, setRejectPostId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => {
    if (status === "PENDING") return "Pending Travel Posts";
    if (status === "APPROVED") return "Approved Travel Posts";
    return "Rejected Travel Posts";
  }, [status]);

  const fetchPosts = async (nextStatus: Status) => {
    setLoading(true);
    try {
      const data = await getTravelPostsByStatus(nextStatus);
      setPosts(data);
    } catch {
      toast.error("Failed to fetch travel posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(status);
  }, [status]);

  const handleApprove = async (postId: string) => {
    setSubmitting(true);
    try {
      await updateTravelPostStatus(postId, "APPROVED");
      toast.success("Post approved");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      toast.error("Failed to approve post");
    } finally {
      setSubmitting(false);
    }
  };

  const openRejectModal = (postId: string) => {
    setRejectPostId(postId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectPostId) return;

    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    setSubmitting(true);
    try {
      await updateTravelPostStatus(rejectPostId, "REJECTED", rejectReason.trim());
      toast.success("Post rejected");
      setPosts((prev) => prev.filter((p) => p.id !== rejectPostId));
      setRejectModalOpen(false);
      setRejectPostId(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject post");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setStatus("PENDING")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              status === "PENDING"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatus("APPROVED")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              status === "APPROVED"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatus("REJECTED")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              status === "REJECTED"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="ml-2 text-gray-600 text-lg">Loading...</span>
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-lg italic text-center">
          No {status.toLowerCase()} posts found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <span className="font-semibold">Title:</span> {post.title}
                </p>
                <p className="text-sm text-gray-500 break-words">{post.excerpt}</p>
                <p className="text-sm">
                  <span className="font-semibold">Author:</span> {post.authorName || post.authorId}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Category:</span> {post.categoryName || post.categoryId}
                </p>
                {post.destinationName && (
                  <p className="text-sm">
                    <span className="font-semibold">Destination:</span> {post.destinationName}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Created:</span> {formatDate(post.createdAt)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      post.status === "APPROVED"
                        ? "text-green-600"
                        : post.status === "REJECTED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </p>

                {post.status === "REJECTED" && post.rejectedReason && (
                  <p className="text-sm text-red-600">
                    <span className="font-semibold">Reason:</span> {post.rejectedReason}
                  </p>
                )}
              </div>

              {status === "PENDING" && (
                <div className="mt-6 flex gap-4">
                  <button
                    disabled={submitting}
                    onClick={() => handleApprove(post.id)}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    disabled={submitting}
                    onClick={() => openRejectModal(post.id)}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-lg w-full relative">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              disabled={submitting}
            >
              ✕
            </button>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reject travel post
              </h3>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter reason..."
                disabled={submitting}
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium"
                  disabled={submitting}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPostModeration;
