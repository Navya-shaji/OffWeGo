import React, { useState, useEffect } from "react";
import { createReviews } from "@/services/Reviews/reviewService";
import type { IReview } from "@/interface/reviews";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Star, Send, Image as ImageIcon, X, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  packageName: string;
  destination: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  packageName,
  destination,
  onSuccess,
}) => {
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  const handleClose = () => {
    setDescription("");
    setRating(5);
    setPhotoFile(null);
    setPreviewUrl("");
    setHoverRating(0);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please write a review description");
      return;
    }

    if (!userId) {
      toast.error("User not found");
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = "";
      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }

      const reviewData: IReview = {
        userId,
        packageName,
        destination,
        description: description.trim(),
        rating,
        photo: photoUrl,
      };

      const response = await createReviews(reviewData);
      if (response?.success) {
        toast.success(response.message || "Review added successfully! 🎉");
        handleClose();
        onSuccess?.();
      } else {
        toast.error(response?.message || "You have already submitted a review for this package");
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error?.response?.data?.message || "Error while submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Package Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">{packageName}</h3>
            </div>
            <p className="text-sm text-gray-600 ml-8">{destination}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-700">
                {rating}/5
              </span>
            </div>
          </div>

          {/* Review Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={5}
              placeholder="Share your experience with this package..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-40 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPhotoFile(null);
                      setPreviewUrl("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-600">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Click to upload photo</span>
                </div>
              )}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !description.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

