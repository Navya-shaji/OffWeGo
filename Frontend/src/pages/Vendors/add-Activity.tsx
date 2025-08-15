import React, { useState } from "react";
import { toast } from "react-toastify";
import { createActivity } from "@/services/Activity/ActivityService"; 
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload"; 
import type { Activity } from "@/interface/PackageInterface"; 

const AddActivity: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      const activityData: Partial<Activity> = {
        title:title,
        description,
        imageUrl: imageUrl,
      };

      await createActivity(activityData);
      toast.success("Activity created successfully!");
      
 
      setTitle("");
      setDescription("");
     
      setImage(null);

    } catch (error) {
        console.log(error)
      toast.error("Error creating activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Activity</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
    
    
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Activity"}
        </button>
      </form>
    </div>
  );
};

export default AddActivity;
