import React, { useState } from "react";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload"; 


const ImageUploader = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {uploading && <p>Uploading...</p>}
      {imageUrl && (
  <img src={imageUrl} alt="Uploaded" className="w-32 h-32 rounded-full object-cover" />
)}

    </div>
  );
};

export default ImageUploader;
