import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Package,
  Sparkles,
  Crown,
  CheckCircle2,
  X,
  Zap,
  TrendingUp,
  Shield,
  Award,
  Home,
  Calendar,
  Clock,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { getSubscriptions } from "@/services/subscription/subscriptionservice";
import { fetchAllPackages } from "@/services/packages/packageService";
import VendorNavbar from "@/components/vendor/navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { createSubscriptionBooking } from "@/services/Payment/stripecheckoutservice";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  packageLimit: number;
  duration: number;
  popular?: boolean;
}

interface VendorSubscription {
  subscriptionId: {
    packageLimit: number;
  };
  status: string;
}

export default function VendorSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [usedSlots, setUsedSlots] = useState(0);
  const [totalAvailableSlots, setTotalAvailableSlots] = useState(3); // Default free slots
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(3);
  const navigate = useNavigate();

  const vendorId = useSelector((state: RootState) => state.vendorAuth.vendor?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [subData, packagesData] = await Promise.all([
          getSubscriptions(),
          fetchAllPackages(1, 100),
        ]);

        console.log("Subscription Data:", subData);
        console.log("Packages Data:", packagesData);

        // Set all subscription plans
        setSubscriptions(subData.data || []);
        
        // Set used slots from packages
        setUsedSlots(packagesData.packages?.length || 0);

        // Calculate total available slots
        // Check if vendor has an active subscription
        if (subData.vendorSubscription) {
          const activeSubscription = subData.vendorSubscription as VendorSubscription;
          if (activeSubscription.status === 'active' && activeSubscription.subscriptionId) {
            // If active subscription exists, use its package limit + free slots
            const subscriptionSlots = activeSubscription.subscriptionId.packageLimit || 0;
            setTotalAvailableSlots(3 + subscriptionSlots); // 3 free + subscription slots
          } else {
            // Only free slots available
            setTotalAvailableSlots(3);
          }
        } else {
          // No subscription, only free slots
          setTotalAvailableSlots(3);
        }
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
  
  const remainingSlots = totalAvailableSlots - usedSlots;
  
  const handleBookPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowBookingModal(true);
  };
  
  const handleProceedToPayment = async () => {
    if (!selectedPlan || !bookingDate || !bookingTime) {
      alert("Please fill in all booking details");
      return;
    }

    if (!vendorId) {
      alert("Vendor ID not found. Please login again.");
      return;
    }

    try {
      setBookingLoading(true);

      sessionStorage.setItem(
        "bookingDetails",
        JSON.stringify({
          vendorId,
          planId: selectedPlan._id,
          date: bookingDate,
          time: bookingTime,
        })
      );
      const response = await createSubscriptionBooking({
        vendorId,
        planId: selectedPlan._id,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        date: bookingDate,
        time: bookingTime,
      });
console.log(response,"responsebdjhjhdg")
      console.log("Redirecting to Stripe:", response.data.checkoutUrl);
      if (response.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("Failed to create payment session");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err instanceof Error ? err.message : "Failed to initiate payment");
      setBookingLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  const handleShowLess = () => {
    setDisplayCount(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log("Stored booking details:", sessionStorage.getItem("bookingDetails"));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading subscription plans...</p>
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
            <p className="text-2xl font-black text-red-600 mb-3">Oops! Something went wrong</p>
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

  const CircularProgress = ({
    value,
    total,
    size = 160,
  }: {
    value: number;
    total: number;
    size?: number;
  }) => {
    const percentage = (value / total) * 100;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{value}</span>
            <span className="text-xl text-gray-500 font-semibold">/{total}</span>
          </div>
          <span className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">
            Used
          </span>
        </div>
      </div>
    );
  };

  const displayedSubscriptions = subscriptions.slice(0, displayCount);
  const hasMore = subscriptions.length > displayCount;
  const showingAll = displayCount >= subscriptions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <VendorNavbar />
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <button
          onClick={() => navigate("/vendor/profile")}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 mb-8"
        >
          <Home className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            Back to Home
          </span>
        </button>

        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-blue-200 rounded-full mb-6 shadow-md">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm font-bold text-blue-600 tracking-wide">
              SUBSCRIPTION MANAGEMENT
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Power Your Business
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Choose the perfect plan to scale your vendor operations and unlock unlimited potential
          </p>
        </div>

        <div className="mb-12 bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">Package Slots</h3>
                  <p className="text-gray-600 text-sm font-medium">
                    Monitor your inventory capacity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 text-sm font-semibold">Active</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900">{usedSlots}</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-600 text-sm font-semibold">Available</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900">
                      {remainingSlots > 0 ? remainingSlots : 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show total available slots info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Total Capacity:</span>
                  <span className="text-lg font-black text-gray-900">{totalAvailableSlots} slots</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalAvailableSlots === 3 ? "Free tier (3 slots)" : `3 free slots + ${totalAvailableSlots - 3} subscription slots`}
                </p>
              </div>

              {remainingSlots <= 0 && (
                <div className="relative overflow-hidden p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 rounded-2xl shadow-md">
                  <div className="flex items-start gap-3">
                    <Crown className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="text-gray-900 font-bold text-base mb-1">
                        🚀 Upgrade Required
                      </p>
                      <p className="text-gray-600 text-sm font-medium">
                        You've used all available slots. Upgrade now to continue growing your business!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <CircularProgress value={usedSlots} total={totalAvailableSlots} />
            </div>
          </div>
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
            <p className="text-gray-400 text-sm mt-2">Check back soon for exciting offers!</p>
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
                        ? "border-blue-500 shadow-xl"
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
                            <Package className="w-7 h-7" />
                          ) : index === 1 ? (
                            <Shield className="w-7 h-7" />
                          ) : (
                            <Award className="w-7 h-7" />
                          )}
                        </div>
                        {index === 2 && (
                          <Crown className="w-7 h-7 text-amber-500 animate-pulse" />
                        )}
                      </div>

                      <h4 className="text-3xl font-black text-gray-900 mb-3">{plan.name}</h4>
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ₹{plan.price}
                          </span>
                          <span className="text-gray-500 text-base font-bold">
                            /{plan.duration} days
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-semibold">
                            {plan.packageLimit} Package Slots
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-semibold">Priority Support 24/7</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-semibold">Advanced Analytics</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-semibold">Custom Integrations</span>
                        </div>
                      </div>

                      <Button
                        className={`w-full font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl py-6 text-base ${
                          index === 0
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
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
                ) : hasMore === false && displayCount > 3 && (
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
                    <span className="text-gray-700 font-bold">Total Amount:</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{selectedPlan.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-gray-300 pt-3 mt-3">
                    <span className="text-gray-600 font-semibold">Duration:</span>
                    <span className="text-gray-900 font-bold">
                      {selectedPlan.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600 font-semibold">Package Slots:</span>
                    <span className="text-gray-900 font-bold">
                      {selectedPlan.packageLimit} slots
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