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

  // Generate HTML <img> tag string
  const htmlImgTag = imageUrl
    ? `<img src="${imageUrl}" alt="Uploaded Image" class="w-32 h-32 rounded-full object-cover" />`
    : "";

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {uploading && <p>Uploading...</p>}

      {imageUrl && (
        <div className="space-y-2">
          {/* Image preview */}
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-32 h-32 rounded-full object-cover"
          />

          {/* HTML <img> tag for copy-paste */}
          <textarea
            readOnly
            className="w-full p-2 border rounded"
            value={htmlImgTag}
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
