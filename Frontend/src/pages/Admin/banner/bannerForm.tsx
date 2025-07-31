import { getBanner } from "@/services/Banner/bannerService";
import type { BannerInterface } from "@/interface/bannerInterface";
import { useEffect, useState } from "react";

export const BannerForm = () => {
  const [banner, setBanner] = useState<BannerInterface[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleToggle = (index: number) => {
    const updated = [...banner];
    updated[index].action = !updated[index].action;
    setBanner(updated);
    // You can call an update API here if needed.
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-lg font-medium">Loading banners...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Banner List</h2>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Video</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {banner.map((ban, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                {ban.Banner_video_url ? (
                  <video width="50" height="40" controls className="rounded shadow">
                    <source src={ban.Banner_video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <span className="text-sm text-gray-500">No video</span>
                )}
              </td>
              <td className="px-4 py-2">{ban.title}</td>
              <td className="px-4 py-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={ban.action}
                    onChange={() => handleToggle(index)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative transition-all duration-200">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 peer-checked:translate-x-full" />
                  </div>
                  <span className="ml-2 text-sm">
                    {ban.action ? "Active" : "Inactive"}
                  </span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
