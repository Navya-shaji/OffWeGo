import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Package,
  Sparkles,
  Crown,
  CheckCircle2,
  X,
  Shield,
  Home,
  Calendar,
  Clock,
  CreditCard,
  ChevronDown,
  History,
  Star,
  Rocket,
} from "lucide-react";
import { getSubscriptions } from "@/services/subscription/subscriptionservice";
import VendorNavbar from "@/components/vendor/navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { createSubscriptionBooking } from "@/services/Payment/stripecheckoutservice";
import { toast } from "react-toastify";
import type { Subscription } from "@/interface/subscription";

interface SubscriptionPlan extends Subscription {
  popular?: boolean;
}

export default function VendorSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(3);
  const navigate = useNavigate();

  const vendorId = useSelector(
    (state: RootState) => state.vendorAuth.vendor?.id
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const subData = await getSubscriptions();

        const transformedSubscriptions = (subData.data || []).map((sub: Subscription) => ({
          ...sub,
          popular: sub.name.toLowerCase().includes('pro') || sub.price > 500
        }));

        setSubscriptions(transformedSubscriptions);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const today = new Date().toISOString().split("T")[0];
    setBookingDate(today);
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setBookingTime(`${hours}:${minutes}`);
  }, []);

  const handleBookPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowBookingModal(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !bookingDate || !bookingTime) {
      toast.error("Please fill in all booking details.");
      return;
    }

    if (!vendorId) {
      toast.error("Please login again.");
      return;
    }

    try {
      setBookingLoading(true);

      sessionStorage.setItem(
        "bookingDetails",
        JSON.stringify({
          vendorId,
          date: bookingDate,
          time: bookingTime,
        })
      );

      localStorage.setItem("vendorId", vendorId || "");
      localStorage.setItem("selectedPlanId", selectedPlan._id || "");

      const response = await createSubscriptionBooking({
        vendorId: vendorId || "",
        planId: selectedPlan._id || "",
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        date: bookingDate,
        time: bookingTime,
      });


      // Handle the actual response format from backend
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        console.error('Invalid response:', response);
        throw new Error("No payment URL provided in response");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(`Subscription Error: Failed to initiate payment`);
      setBookingLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 3);
  };

  const handleShowLess = () => {
    setDisplayCount(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedSubscriptions = subscriptions.slice(0, displayCount);
  const hasMore = subscriptions.length > displayCount;
  const showingAll = displayCount >= subscriptions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            Loading subscription plans...
          </p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-8 bg-white border-2 border-red-200 rounded-2xl max-w-md shadow-xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-black text-red-600 mb-3">
              Oops! Something went wrong
            </p>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-md"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <VendorNavbar />
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/vendor/profile")}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              Back to Home
            </span>
          </button>
          
          <button
            onClick={() => navigate("/vendor/subscription/history")}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <History className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              Subscription History
            </span>
          </button>
        </div>

        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-blue-200 rounded-full mb-6 shadow-md">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-bold text-blue-600 tracking-wide">
              SUBSCRIPTION MANAGEMENT
            </span>
          </div>
        
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Choose the perfect plan to scale your vendor operations and unlock
            unlimited potential
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 font-medium">
            Unlock more features as you grow • Flexible pricing for every stage
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-3xl shadow-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No subscription plans available at the moment.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back soon for exciting offers!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {displayedSubscriptions.map((plan, index) => (
                <div
                  key={plan._id}
                  className={`relative group ${plan.popular ? "lg:-mt-4" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-50"></div>
                        <div className="relative px-5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Most Popular
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative bg-white border-2 ${
                      plan.popular
                        ? "border-black shadow-xl"
                        : "border-gray-200 shadow-md"
                    } rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`p-4 rounded-2xl shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                              : index === 1
                              ? "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600"
                              : "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600"
                          }`}
                        >
                          {index === 0 ? (
                            <Rocket className="w-7 h-7" />
                          ) : index === 1 ? (
                            <Shield className="w-7 h-7" />
                          ) : (
                            <Crown className="w-7 h-7" />
                          )}
                        </div>
                        {index === 2 && (
                          <Star className="w-7 h-7 text-amber-500 animate-pulse" />
                        )}
                      </div>

                      <h4 className="text-3xl font-black text-gray-900 mb-3">
                        {plan.name}
                      </h4>
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-6xl font-black bg-gradient-to-r bg-black bg-clip-text text-transparent">
                            ₹{plan.price}
                          </span>
                          <span className="text-gray-500 text-base font-bold">
                            /{plan.duration} days
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                        
                          
                        </div>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gray to-black flex items-center justify-center shadow-md">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-700 font-semibold">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={`w-full font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl py-6 text-base ${
                          index === 0
                            ? "bg-gradient-to-r bg-black"
                            : index === 1
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        } hover:scale-105`}
                        onClick={() => handleBookPlan(plan)}
                      >
                        Book Now →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {subscriptions.length > 3 && (
              <div className="flex justify-center mt-10">
                {!showingAll ? (
                  <button
                    onClick={handleLoadMore}
                    className="group relative px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                        Load More Plans
                      </span>
                      <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 group-hover:animate-bounce transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Showing {displayCount} of {subscriptions.length} plans
                    </p>
                  </button>
                ) : (
                  hasMore === false &&
                  displayCount > 3 && (
                    <button
                      onClick={handleShowLess}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                          Show Less
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 rotate-180 transition-colors" />
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}

        {showBookingModal && selectedPlan && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-in fade-in duration-300">
            <div className="relative bg-white border-2 border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-6 right-6 p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90 z-10"
                disabled={bookingLoading}
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-full mb-6 shadow-md">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-600 tracking-wide">
                      SECURE PAYMENT VIA STRIPE
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-3">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Select your preferred date and time
                  </p>
                </div>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Booking Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      disabled={bookingLoading}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Booking Time
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      disabled={bookingLoading}
                    />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-2xl mb-8 shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-bold">
                      Total Amount:
                    </span>
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{selectedPlan.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-gray-300 pt-3 mt-3">
                    <span className="text-gray-600 font-semibold">
                      Duration:
                    </span>
                    <span className="text-gray-900 font-bold">
                      {selectedPlan.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600 font-semibold">
                      Package Slots:
                    </span>
                    <span className="text-gray-900 font-bold">
                      Premium Access
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mb-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 font-bold text-white text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 py-6 hover:scale-105"
                  onClick={handleProceedToPayment}
                  disabled={bookingLoading || !bookingDate || !bookingTime}
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment →
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-6 rounded-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setShowBookingModal(false)}
                  disabled={bookingLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}