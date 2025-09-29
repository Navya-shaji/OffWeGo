import React from "react";
import { Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";

interface ImageUploadSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images,
  onImagesChange
}) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files).slice(0, 5 - images.length);
    const uploadedUrls: string[] = [];
    
    for (const file of fileArray) {
      try {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
    
    onImagesChange([...images, ...uploadedUrls].slice(0, 5));
  };
  
  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  // Inline SVG placeholder as data URL to prevent network requests
  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Cpath d='M25 35l10 10 20-20' stroke='%23d1d5db' stroke-width='2' fill='none'/%3E%3Ctext x='40' y='55' text-anchor='middle' font-family='Arial' font-size='10' fill='%239ca3af'%3EImage%3C/text%3E%3C/svg%3E";

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-purple-600" />
        Package Images ({images.length}/5)
      </h3>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={images.length >= 5}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {images.length >= 5 
                ? "Maximum 5 images reached" 
                : `Click to upload images (${5 - images.length} remaining)`
              }
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG up to 10MB each
            </p>
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Package image ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    // Prevent infinite loops by only setting placeholder once
                    if (e.currentTarget.src !== placeholderSvg) {
                      e.currentTarget.src = placeholderSvg;
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;