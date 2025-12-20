import React, { useState, useEffect } from "react";
import { createReviews } from "@/services/Reviews/reviewService";
import { getUserBookings } from "@/services/Booking/bookingService";
import type { IReview } from "@/interface/reviews";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Star, Send, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

interface BookedPackage {
  packageId: string;
  packageName: string;
  destination: string;
}

const UserAddReview: React.FC = () => {
  const [bookedPackages, setBookedPackages] = useState<BookedPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const SelectPackage = () => {
    toast.error("Select Package");
  };
 
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchBookedPackages = async () => {
      try {
        setIsLoading(true);
        const bookings = await getUserBookings();

        if (!Array.isArray(bookings) || bookings.length === 0) {
          setBookedPackages([]);
          setIsLoading(false);
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedPackages: BookedPackage[] = bookings
          .map((b) => {
            const pkg = b.selectedPackage;

            if (!pkg || !pkg._id || !pkg.packageName) {
              return null;
            }

            const startDate = new Date(b.selectedDate);
            startDate.setHours(0, 0, 0, 0);

            const duration = pkg.duration || 0;
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
            endDate.setHours(23, 59, 59, 999);

            if (endDate < today) {
              return {
                packageId: pkg._id,
                packageName: pkg.packageName,
                destination:
                  pkg.destinationId || pkg.destination || "Unknown Destination",
              };
            }

            return null;
          })
          .filter((p): p is BookedPackage => p !== null);

        setBookedPackages(completedPackages);
      } catch (error) {
        console.error("Error fetching booked packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedPackages();
  }, [userId]);

  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackageId) {
      SelectPackage();
      return;
    }

    if (!userId) {
      toast.error("User Not found");
      return;
    }

    const selectedPackage = bookedPackages.find(
      (p) => p.packageId === selectedPackageId
    );

    if (!selectedPackage) {
      SelectPackage()
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
        packageName: selectedPackage.packageName,
        destination: selectedPackage.destination,
        description,
        rating,
        photo: photoUrl,
      };
  
      const response=await createReviews(reviewData);
      console.log(response,"res")
      if (response.data.success) {
      toast.success(response.data.message || "Review added successfully!");
      setDescription("");
      setRating(5);
      setPhotoFile(null);
      setPreviewUrl("");
      setSelectedPackageId("");
    } else {
    
      toast.error(response.data.message || "You have already submitted a review for this package");
    }
      // toast.success("Review Added")

      setDescription("");
      setRating(5);
      setPhotoFile(null);
      setPreviewUrl("");
      setSelectedPackageId("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error while submitting review")
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl ">
        <div className="bg-white rounded-xl shadow-lg p-1">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            <div>
              <h2 className="text-2xl font-bold text-white">Write a Review</h2>
              <p className="text-blue-100 text-sm">
                Share your travel experience
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {bookedPackages.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                No Completed Trips
              </h3>
              <p className="text-gray-600 text-sm">
                Complete a trip to leave a review
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Select Trip
                </label>
                <div className="relative">
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Choose a trip...</option>
                    {bookedPackages.map((pkg) => (
                      <option key={pkg.packageId} value={pkg.packageId}>
                        {pkg.packageName}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Review
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                  className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-32 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhotoFile(null);
                          setPreviewUrl("");
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm">Click to upload photo</span>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAddReview;
