import React from "react";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { X, MapPin, Image, Globe } from "lucide-react";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";

interface Props {
  destination: DestinationInterface;
  onClose: () => void;
  onChange: (updated: DestinationInterface) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditDestinationModal: React.FC<Props> = ({
  destination,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Destination
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Destination Name
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter destination name"
              value={destination.name}
              onChange={(e) =>
                onChange({ ...destination, name: e.target.value })
              }
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location"
              value={destination.location}
              onChange={(e) =>
                onChange({ ...destination, location: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter destination description"
              value={destination.description}
              onChange={(e) =>
                onChange({ ...destination, description: e.target.value })
              }
            />
          </div>

          {/* Image Upload */}
          {/* Image Upload */}
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
    <Image className="w-4 h-4" />
    Image
  </label>
  <input
    type="file"
    accept="image/*"
    className="w-full border p-2 rounded"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const imageUrl = await uploadToCloudinary(file);
        console.log("✅ Uploaded Image URL:", imageUrl);

        // Add fallback if imageUrls is undefined
        const updated = {
          ...destination,
          imageUrls: [imageUrl],
        };
        console.log("📦 Updated destination with image:", updated);
        onChange(updated);
      } catch (err) {
        console.error("❌ Image upload failed:", err);
      }
    }}
  />
</div>

{/* Preview */}
{destination.imageUrls?.[0] && (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Image Preview</label>
    <div className="relative">
      <img
        src={destination.imageUrls[0]}
        alt="Preview"
        className="w-full h-48 object-cover rounded-lg border border-gray-200"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <p className="text-xs text-gray-500 mt-1 break-all">
        {destination.imageUrls[0]}
      </p>
    </div>
  </div>
)}


          {/* Coordinates */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Coordinates
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Latitude</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  step="any"
                  placeholder="0.000000"
                  value={destination.coordinates?.lat ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...destination,
                      coordinates: {
                        ...destination.coordinates,
                        lat: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Longitude</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  step="any"
                  placeholder="0.000000"
                  value={destination.coordinates?.lng ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...destination,
                      coordinates: {
                        ...destination.coordinates,
                        lng: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {destination.imageUrls?.[0] && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Image Preview
              </label>
              <div className="relative">
                <img
                  src={destination.imageUrls[0]}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
