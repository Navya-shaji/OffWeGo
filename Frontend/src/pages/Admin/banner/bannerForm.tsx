import { getBanner, actionBannerupdate, BannerDelete } from "@/services/Banner/bannerService";
import type { BannerInterface } from "@/interface/bannerInterface";
import { useEffect, useState } from "react";
import { Trash, XCircle } from "lucide-react";

export const BannerForm = () => {
  const [banner, setBanner] = useState<BannerInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; id: string | null; title: string | null }>({
    open: false,
    id: null,
    title: null,
  });

  const fetchData = async () => {
    try {
      const data = await getBanner();
      setBanner(data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setLoading(false);
    }
  };

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
      setBanner((prev) => prev.filter((b) => b.id !== confirmModal.id));
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
            {banner.map((ban, index) => (
              <tr key={ban.id} className="hover:bg-gray-50 transition">
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
                <td className="px-6 py-4 font-medium text-gray-800">{ban.title}</td>
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
                      setConfirmModal({ open: true, id: ban.id || null, title: ban.title || null })
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

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] sm:w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setConfirmModal({ open: false, id: null, title: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-black">
                {confirmModal.title || "this banner"}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, id: null, title: null })}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
