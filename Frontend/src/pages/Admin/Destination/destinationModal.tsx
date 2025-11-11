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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-r bg-gray-100 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black">Edit Destination</h2>
                  <p className=" text-black text-xs">Update travel details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-all duration-200 group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-5">
            <div className="grid grid-cols-5 gap-5">
              <div className="col-span-2 space-y-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Image className="w-3 h-3 text-pink-600" />
                  Destination Image
                </label>
                
                {destination.imageUrls?.[0] ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group">
                    <img
                      src={destination.imageUrls[0]}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label
                        htmlFor="image-upload"
                        className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3 h-3" />
                        Change Image
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <Upload className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700 mt-2">Upload Image</p>
                    <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                  </label>
                )}

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

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Geographic Coordinates
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        type="number"
                        step="any"
                        value={destination.coordinates?.lat ?? ""}
                        disabled
                        placeholder="Latitude"
                      />
                    </div>
                    <div className="relative">
                      <input
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        type="number"
                        step="any"
                        value={destination.coordinates?.lng ?? ""}
                        disabled
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Auto-generated
                  </p>
                </div>
              </div>

              <div className="col-span-3 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Destination Name
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Santorini Island"
                    value={destination.name}
                    onChange={(e) =>
                      onChange({ ...destination, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1.5">
                    <MapPin className="w-3 h-3 text-purple-600" />
                    Location
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      value={destination.location}
                      disabled
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                      Fixed
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Describe what makes this destination special..."
                    value={destination.description}
                    onChange={(e) =>
                      onChange({ ...destination, description: e.target.value })
                    }
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">Compelling description</p>
                    <span className="text-xs text-gray-400">
                      {destination.description?.length || 0} chars
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={onSubmit}
                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};