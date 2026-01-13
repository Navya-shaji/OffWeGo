import { useState, useEffect } from "react";
import { Star, User as UserIcon, MessageCircle, ThumbsUp } from "lucide-react";
import { allReviews } from "@/services/Reviews/reviewService";
import type { IReview, User as ReviewUser } from "@/interface/reviews";

interface PackageReviewsProps {
  packageName: string;
}

export const PackageReviews: React.FC<PackageReviewsProps> = ({
  packageName,
}) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await allReviews(packageName);
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.warn("Reviews response is not an array", data);
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (packageName) fetchReviews();
  }, [packageName]);

  const calculateAverageRating = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 p-6 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-900 mb-2 font-bold">Unable to load reviews</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-10">
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">Be the first to share your experience with this package!</p>
        </div>
      ) : (
        <>
          {/* Summary Section */}
          <div className="grid md:grid-cols-12 gap-8 items-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
            {/* Average Big Score */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-8">
              <span className="text-7xl font-black text-gray-900 leading-none mb-2">
                {averageRating}
              </span>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(Number(averageRating))
                      ? "text-orange-500 fill-orange-500"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Overall Rating
              </p>
              <p className="text-xs text-gray-400 mt-1">Based on {reviews.length} reviews</p>
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-8 flex flex-col justify-center gap-3">
              {ratingDistribution.map((count, index) => {
                const stars = 5 - index;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-700 w-8 flex-shrink-0 flex items-center gap-1">
                      {stars} <Star className="w-3 h-3 text-gray-400" />
                    </span>
                    <div className="flex-1 h-3 bg-white rounded-full overflow-hidden shadow-inner border border-gray-100">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-400 w-10 text-right">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Feedback</h3>
              <div className="text-sm text-gray-500 font-medium">Sorted by: <span className="text-black">Newest</span></div>
            </div>

            <div className="grid gap-6">
              {reviews.map((review) => {
                const isUser = typeof review.userId === "object" && review.userId !== null;
                const userName = isUser ? (review.userId as ReviewUser).name : "Anonymous User";
                const userPhoto = isUser ? (review.userId as ReviewUser).photo : null;
                const reviewId = isUser ? (review.userId as ReviewUser)._id : (review.userId as string);

                return (
                  <div
                    key={reviewId}
                    className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          {userPhoto ? (
                            <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{userName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating
                                  ? "text-orange-500 fill-orange-500"
                                  : "text-gray-200"
                                  }`}
                              />
                            ))}
                            <span className="text-xs font-bold text-gray-400 ml-1">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                        Verified Stay
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed pl-[4rem]">
                      "{review.description}"
                    </p>

                    <div className="flex items-center gap-4 pl-[4rem] mt-4 pt-4 border-t border-gray-50">
                      <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" /> Helpful
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
