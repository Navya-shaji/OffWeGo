import React, { useState, useEffect } from "react";
import { createReviews } from "@/services/Reviews/reviewService";
import { getUserBookings } from "@/services/Booking/bookingService"; // import service
import type { IReview } from "@/interface/reviews";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

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
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id;


  useEffect(() => {
    if (!userId) return;
    const fetchBookedPackages = async () => {
      try {
        const bookings = await getUserBookings(userId); 
        const packages = bookings.map((b) => ({
          packageId: b.packageId,
          packageName: b.packageName,
          destination: b.destination,
        }));
        setBookedPackages(packages);
      } catch (error) {
        console.error("Error fetching booked packages", error);
      }
    };
    fetchBookedPackages();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackageId) {
      alert("Please select a package to review.");
      return;
    }

    const selectedPackage = bookedPackages.find(p => p.packageId === selectedPackageId);
    if (!selectedPackage) return;

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

      await createReviews(reviewData);
      alert("Review added successfully!");

      setDescription("");
      setRating(5);
      setPhotoFile(null);
      setSelectedPackageId("");
    } catch (error) {
      alert(error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Select Package:</label>
          <select
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Package</option>
            {bookedPackages.map(pkg => (
              <option key={pkg.packageId} value={pkg.packageId}>
                {pkg.packageName} - {pkg.destination}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Review:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Rating:</label>
          <input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Photo (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default UserAddReview;
