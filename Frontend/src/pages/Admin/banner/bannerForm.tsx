import { getBanner, actionBannerupdate, BannerDelete } from "@/services/Banner/bannerService";
import type { BannerInterface } from "@/interface/bannerInterface";
import { useEffect, useState, useRef, useCallback } from "react";
import { Trash } from "lucide-react";
import { ConfirmModal } from "@/components/Modular/ConfirmModal";

export const BannerForm = () => {
  const [banner, setBanner] = useState<BannerInterface[]>([]);
  const [displayedBanners, setDisplayedBanners] = useState<BannerInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const ITEMS_PER_PAGE = 10;

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    id: string | null;
    title: string | null;
  }>({
    open: false,
    id: null,
    title: null,
  });

  const fetchData = async () => {
    try {
      const response = await getBanner();
      const data = response?.data || response;
      const allBanners = Array.isArray(data) ? data : [];
      setBanner(allBanners);
      setDisplayedBanners(allBanners.slice(0, ITEMS_PER_PAGE));
      setHasMore(allBanners.length > ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Failed to fetch banners", error);
      setBanner([]);
      setDisplayedBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBanners = useCallback(() => {
    if (loadingMore || !hasMore || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    setTimeout(() => {
      const nextEndIndex = (page + 1) * ITEMS_PER_PAGE;
      const nextBatch = banner.slice(0, nextEndIndex);

      setDisplayedBanners(nextBatch);
      setPage(prev => prev + 1);
      setHasMore(banner.length > nextEndIndex);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }, 300);
  }, [banner, page, loadingMore, hasMore]);


  const handleToggle = async (index: number) => {
    try {
      const updated = [...banner];
      const ban = updated[index];

      if (!ban.id) return console.error("Banner ID is missing!");

      const newAction = !ban.action;
      const updatedBanner = await actionBannerupdate(ban.id, newAction);

      updated[index].action = updatedBanner.action;
      setBanner(updated);
    } catch (error) {
      console.error("Failed to update banner action", error);
    }
  };

  const handleDelete = async () => {
    if (!confirmModal.id) return;
    try {
      await BannerDelete(confirmModal.id);
      const updatedBanners = banner.filter((b) => b.id !== confirmModal.id);
      setBanner(updatedBanners);
      setDisplayedBanners(updatedBanners.slice(0, page * ITEMS_PER_PAGE));
      setHasMore(updatedBanners.length > page * ITEMS_PER_PAGE);
      setConfirmModal({ open: false, id: null, title: null });
    } catch (error) {
      console.error("Failed to delete banner", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-lg font-medium">Loading banners...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 relative">
      <h2 className="text-xl font-bold mb-4">Banner Listing</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Video</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {displayedBanners.map((ban, index) => (
              <tr key={ban.id || index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {ban.Banner_video_url ? (
                    <video
                      width="120"
                      height="80"
                      controls
                      className="rounded-md shadow-sm border border-gray-200"
                    >
                      <source src={ban.Banner_video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <span className="text-gray-400 italic">No video</span>
                  )}
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  {ban.title}
                </td>

                <td className="px-6 py-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={ban.action}
                      onChange={() => handleToggle(index)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-200" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {ban.action ? "Active" : "Inactive"}
                    </span>
                  </label>
                </td>

                <td className="px-6 py-4">
                  <button
                    className="text-red-500 hover:text-red-700 font-medium"
                    onClick={() =>
                      setConfirmModal({
                        open: true,
                        id: ban.id || null,
                        title: ban.title || null,
                      })
                    }
                  >
                    <Trash size={16} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMore && displayedBanners.length > 0 && !loading && (
        <div className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={loadMoreBanners}
            disabled={loadingMore}
            className={`group relative px-10 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${loadingMore ? "opacity-80 cursor-not-allowed" : ""
              }`}
          >
            {loadingMore ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                <span>Fetching Banners...</span>
              </>
            ) : (
              <>
                <span>Load More Banners</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && displayedBanners.length > 0 && (
        <div className="p-8 text-center text-sm text-gray-500 bg-gray-50/30 border-t border-gray-100 italic">
          You've reached the end of the banner list
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.open}
        title="Delete Banner"
        message={`Are you sure you want to delete "${confirmModal.title}"?`}
        onConfirm={handleDelete}
        onCancel={() =>
          setConfirmModal({ open: false, id: null, title: null })
        }
        confirmText="Yes, Delete"
      />
    </div>
  );
};