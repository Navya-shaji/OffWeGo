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

export default function VendorSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [usedSlots, setUsedSlots] = useState(0);
  const [totalFreeSlots] = useState(3);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  const vendorId = useSelector((state: RootState) => state.auth.user?.id);

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

        setSubscriptions(subData);
        setUsedSlots(packagesData.packages?.length || 0);
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

  const remainingSlots = totalFreeSlots - usedSlots;

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
console.log("Stored booking details:", sessionStorage.getItem("bookingDetails"));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl max-w-md">
            <p className="text-xl font-semibold text-red-600 mb-2">
              Error loading data
            </p>
            <p className="text-sm text-red-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
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
            <span className="text-xl text-gray-500 font-semibold">
              /{total}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">
            Used
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div
          onClick={() => navigate("/vendor/profile")}
          className="cursor-pointer hover:text-indigo-600 transition-all"
        >
          <Home />
        </div>
        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Subscription Management
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Power Your Business
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the perfect plan to scale your vendor operations
          </p>
        </div>

        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Package Slots
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Monitor your inventory capacity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600 text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">
                    {usedSlots}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600 text-sm font-medium">
                      Available
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900">
                    {remainingSlots > 0 ? remainingSlots : 0}
                  </p>
                </div>
              </div>

              {remainingSlots <= 0 && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-900 font-semibold text-sm mb-1">
                        Upgrade Required 🚀
                      </p>
                      <p className="text-gray-600 text-xs">
                        You've used all free slots. Upgrade to continue growing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <CircularProgress value={usedSlots} total={totalFreeSlots} />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Unlock more features as you grow
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No subscription plans available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {subscriptions.map((plan, index) => (
              <div
                key={plan._id}
                className={`relative group ${
                  plan.popular ? "md:-mt-4 md:mb-0" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`relative bg-white border-2 ${
                    plan.popular ? "border-blue-500" : "border-gray-200"
                  } rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:scale-105`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`p-3 rounded-xl ${
                          index === 0
                            ? "bg-blue-100 text-blue-600"
                            : index === 1
                            ? "bg-purple-100 text-purple-600"
                            : "bg-pink-100 text-pink-600"
                        }`}
                      >
                        {index === 0 ? (
                          <Package className="w-6 h-6" />
                        ) : index === 1 ? (
                          <Shield className="w-6 h-6" />
                        ) : (
                          <Award className="w-6 h-6" />
                        )}
                      </div>
                      {index === 2 && (
                        <Crown className="w-6 h-6 text-amber-500" />
                      )}
                    </div>

                    <h4 className="text-2xl font-black text-gray-900 mb-2">
                      {plan.name}
                    </h4>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-5xl font-black text-gray-900">
                          ₹{plan.price}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                          /{plan.duration} days
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          {plan.packageLimit} Package Slots
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          Priority Support 24/7
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          Advanced Analytics
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          Custom Integrations
                        </span>
                      </div>
                    </div>

                    <Button
                      className={`w-full font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg ${
                        index === 0
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          : index === 1
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      } hover:scale-105`}
                      onClick={() => handleBookPlan(plan)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showBookingModal && selectedPlan && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                disabled={bookingLoading}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Secure Payment via Stripe
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-gray-600">
                    Select your preferred date and time
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Booking Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={bookingLoading}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4" />
                      Booking Time
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={bookingLoading}
                    />
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      Total Amount:
                    </span>
                    <span className="text-3xl font-black text-gray-900">
                      ₹{selectedPlan.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-700 font-medium">
                      {selectedPlan.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Package Slots:</span>
                    <span className="text-gray-700 font-medium">
                      {selectedPlan.packageLimit} slots
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mb-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-bold text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handleProceedToPayment}
                  disabled={bookingLoading || !bookingDate || !bookingTime}
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
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
