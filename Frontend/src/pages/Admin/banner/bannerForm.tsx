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
   
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-lg font-medium">Loading banners...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      
  <h2 className="text-xl font-bold mb-4">Banner Listing</h2>
  
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Video</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {banner.map((ban, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
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
              </tr>
            ))}
          </tbody>  
        </table>
      </div>
    </div>
  );
};
