import React from "react";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { X, MapPin, Image, Globe } from "lucide-react";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { motion, AnimatePresence } from "framer-motion";

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Destination
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Destination Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 transition-all"
                placeholder="Enter destination name"
                value={destination.name}
                onChange={(e) =>
                  onChange({ ...destination, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                Location
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                value={destination.location}
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none"
                placeholder="Enter destination description"
                value={destination.description}
                onChange={(e) =>
                  onChange({ ...destination, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-600" />
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded-lg text-sm file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-800 file:font-semibold hover:file:bg-blue-200 transition"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const imageUrl = await uploadToCloudinary(file);
                    onChange({ ...destination, imageUrls: [imageUrl] });
                  } catch (err) {
                    console.error("Image upload failed:", err);
                  }
                }}
              />
            </div>

            {destination.imageUrls?.[0] && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Image Preview
                </label>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={destination.imageUrls[0]}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Coordinates
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  type="number"
                  step="any"
                  value={destination.coordinates?.lat ?? ""}
                  disabled
                  placeholder="Latitude"
                />
                <input
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  type="number"
                  step="any"
                  value={destination.coordinates?.lng ?? ""}
                  disabled
                  placeholder="Longitude"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-blue-800 font-medium shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
