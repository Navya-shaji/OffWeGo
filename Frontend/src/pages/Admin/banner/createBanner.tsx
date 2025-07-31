import React, { useState } from "react";
import { addBanner } from "@/services/Banner/bannerService";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";

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

    if (!title || !video) {
      toast.error("Title and video are required");
      return;
    }

    try {
      setLoading(true);

      let uploadedVideoUrl = videoUrl;
      if (!uploadedVideoUrl) {
        uploadedVideoUrl = await uploadToCloudinary(video);
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
    <div className="max-w-xl mx-auto p-6 shadow-md rounded-xl bg-white space-y-6">
      <h2 className="text-2xl font-bold">Create Banner</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter banner title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="video">Upload Video</Label>
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
          />
          <Button
            type="button"
            onClick={handleUpload}
            className="mt-2"
            disabled={loading || !video}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </Button>
          {videoUrl && (
            <div className="mt-3">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="active">Active</Label>
          <Switch id="active" checked={action} onCheckedChange={setAction} />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !videoUrl}
        >
          {loading ? "Creating..." : "Create Banner"}
        </Button>
      </form>
    </div>
  );
};

export default CreateBanner;
