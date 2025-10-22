import { useState, useEffect } from "react";
import { Star, User, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allReviews } from "@/services/Reviews/reviewService";
import type { IReview } from "@/interface/reviews";

interface PackageReviewsProps {
  packageId: string;
}

export const PackageReviews: React.FC<PackageReviewsProps> = ({
  packageId,
}) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(reviews, "Reviews");
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await allReviews(packageId);

        // Ensure it's an array
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

    if (packageId) fetchReviews();
  }, [packageId]);

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
      <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-slate-600">
              Loading reviews...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-white/20 rounded-xl">
            <Star className="h-6 w-6 fill-white" />
          </div>
          Guest Reviews
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-slate-500">
              Be the first to share your experience with this package
            </p>
          </div>
        ) : (
          <>
            {/* Rating Summary */}
            <div className="grid md:grid-cols-2 gap-8 mb-10 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-slate-800 mb-2">
                  {averageRating}
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(Number(averageRating))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 font-medium">
                  Based on {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map((count, index) => {
                  const stars = 5 - index;
                  const percentage =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700 w-12">
                        {stars} star
                      </span>
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

           
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                What travelers are saying
              </h3>
              {reviews.map((review) => (
             <div
  key={typeof review.userId === "string" ? review.userId : review.userId._id}
  className="p-6 bg-white ..."
>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                        {review.photo ? (
                          <img
                            src={review.photo}
                            alt={`${review.packageName} `}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>

                    
                      <div>
                        <div className="font-bold text-slate-800">
                       {typeof review.userId === "string" ? "Anonymous" : review.userId.name}


                        </div>
                        <div className="text-sm text-slate-500">
                       
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed mb-4">
                    {review.description}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100"></div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
