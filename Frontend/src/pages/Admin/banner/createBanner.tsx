import React, { useState } from "react";
import { addBanner } from "@/services/Banner/bannerService";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { BannerSchema } from "@/Types/Admin/Banner/BannerSchema";

const CreateBanner: React.FC = () => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [action, setAction] = useState(false);
  const [loading, setLoading] = useState(false);

  const notify = () => toast("Banner Added");

  const handleUpload = async () => {
    if (!video) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setLoading(true);
      const url = await uploadToCloudinary(video);
      setVideoUrl(url);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Video upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = BannerSchema.safeParse({
      title,
      video,
      action,
    });

    if (!validation.success) {
      validation.error.issues.forEach((err) => toast.error(err.message));
      return;
    }

    try {
      setLoading(true);

      let uploadedVideoUrl = videoUrl;
      if (!uploadedVideoUrl) {
        uploadedVideoUrl = await uploadToCloudinary(video!);
        setVideoUrl(uploadedVideoUrl);
        toast.success("Video uploaded successfully!");
      }

      const newBanner = {
        title,
        Banner_video_url: uploadedVideoUrl,
        action,
      };

      await addBanner(newBanner);
      notify();

      setTitle("");
      setVideo(null);
      setVideoUrl("");
      setAction(false);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting banner:", error);
      toast.error("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create Banner</h2>
          <p className="text-sm text-gray-300 mt-1">
            Add a new promotional banner
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Banner Title <span className="text-red-500"></span>
            </Label>
            <Input
              id="title"
              placeholder="Enter banner title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div>
            <Label
              htmlFor="video"
              className="text-sm font-semibold text-gray-700 mb-1 block"
            >
              Upload Video <span className="text-red-500"></span>
            </Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setVideo(e.target.files[0]);
                  setVideoUrl("");
                }
              }}
              className="w-full border border-gray-300 rounded-lg"
            />
            <Button
              type="button"
              onClick={handleUpload}
              className="mt-3"
              disabled={loading || !video}
            >
              {loading ? "Uploading..." : "Upload Video"}
            </Button>

            {videoUrl && (
              <div className="mt-4">
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg border border-gray-300"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}
          </div>

          
          <div className="flex items-center gap-4">
            <Label
              htmlFor="active"
              className="text-sm font-semibold text-gray-700"
            >
              Active
            </Label>
            <Switch id="active" checked={action} onCheckedChange={setAction} />
          </div>

        
          <Button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            disabled={loading || !videoUrl}
          >
            {loading ? "Creating..." : "Create Banner"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateBanner;
