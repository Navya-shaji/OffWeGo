import React from "react";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { X, MapPin, Image, Globe, Upload, Check } from "lucide-react";
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
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-r bg-black p-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Edit Destination
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Update your travel destination details
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination Name
              </label>
              <input
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 group-hover:border-gray-300"
                placeholder="e.g., Santorini Island"
                value={destination.name}
                onChange={(e) =>
                  onChange({ ...destination, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                Location
              </label>
              <div className="relative">
                <input
                  className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={destination.location}
                  disabled
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                  Fixed
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={5}
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 group-hover:border-gray-300"
                placeholder="Describe what makes this destination special..."
                value={destination.description}
                onChange={(e) =>
                  onChange({ ...destination, description: e.target.value })
                }
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Write a compelling description for travelers
                </p>
                <span className="text-xs text-gray-400">
                  {destination.description?.length || 0} characters
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Image className="w-4 h-4 text-pink-600" />
                Destination Image
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
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
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or WEBP (Max 5MB)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {destination.imageUrls?.[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Check className="w-4 h-4 text-green-600" />
                  Image Preview
                </label>
                <div className="relative rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg group">
                  <img
                    src={destination.imageUrls[0]}
                    alt="Preview"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Current Image</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

         
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Geographic Coordinates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    type="number"
                    step="any"
                    value={destination.coordinates?.lat ?? ""}
                    disabled
                    placeholder="Latitude"
                  />
                  <span className="absolute left-4 -top-2 px-2 bg-white text-xs font-medium text-gray-500">
                    Latitude
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    type="number"
                    step="any"
                    value={destination.coordinates?.lng ?? ""}
                    disabled
                    placeholder="Longitude"
                  />
                  <span className="absolute left-4 -top-2 px-2 bg-white text-xs font-medium text-gray-500">
                    Longitude
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Coordinates are auto-generated and cannot be modified
              </p>
            </div>
          </form>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              className="px-8 py-3.5 bg-gradient-to-r bg-black text-white rounded-xl hover:shadow-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};