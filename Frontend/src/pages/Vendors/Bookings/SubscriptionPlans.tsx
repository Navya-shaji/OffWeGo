import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {

  Sparkles,
  Crown,
  CheckCircle2,
  X,
  Shield,
  Home,
  ChevronDown,
  History,
  Rocket,
} from "lucide-react";
import { getSubscriptions } from "@/services/subscription/subscriptionservice";
import VendorNavbar from "@/components/vendor/navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { createSubscriptionBooking } from "@/services/Payment/stripecheckoutservice";
import { toast } from "react-hot-toast";
import type { Subscription } from "@/interface/subscription";

interface SubscriptionPlan extends Subscription {
  popular?: boolean;
}

export default function VendorSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const vendorId = useSelector(
    (state: RootState) => state.vendorAuth.vendor?.id
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        const subData = await getSubscriptions();

        const transformedSubscriptions = (subData.data || []).map((sub: Subscription) => ({
          ...sub,
          popular: sub.name.toLowerCase().includes('pro') || sub.price > 500
        }));

        setSubscriptions(transformedSubscriptions);
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        const errorMessage = (err as Error).message || "Failed to load subscription plans";
        toast.error(errorMessage);
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
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    setBookingDate(today);
    setBookingTime(`${hours}:${minutes}`);
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


      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        console.error('Invalid response:', response);
        throw new Error("No payment URL provided in response");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      // Only show the message from the backend, without extra prefixes
      const errorMessage = (err as Error).message || "Failed to initiate payment";
      toast.error(errorMessage);
      setBookingLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-700 font-semibold text-lg">
            Loading subscription plans...
          </p>
          <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50/50 font-['Outfit']">
      <VendorNavbar />

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Breadcrumb/Navigation Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Subscription Plans
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Manage your premium partner status and features
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/vendor/profile")}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate("/vendor/subscription/history")}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Payment History
            </button>
          </div>
        </div>

        {/* Welcome/Promo Banner Section (Dashboard Style) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Premium Growth</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Unlock higher booking limits & premium visibility
              </h2>
              <p className="text-gray-600 font-medium">
                Our subscription plans are designed to help you scale your travel business
                faster with prioritized search results and advanced analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {subscriptions.map((plan, index) => (
            <div
              key={plan._id}
              className={`relative ${plan.popular ? "transform lg:-translate-y-2" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Best Value
                  </span>
                </div>
              )}

              <div className={`h-full bg-white border ${plan.popular ? "border-emerald-500 ring-4 ring-emerald-50" : "border-gray-200"} rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}>
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${index === 1 ? "bg-emerald-50 text-emerald-600" :
                    index === 2 ? "bg-gray-100 text-gray-700" :
                      "bg-blue-50 text-blue-600"
                    }`}>
                    {index === 0 ? <Rocket className="w-8 h-8" /> :
                      index === 1 ? <Shield className="w-8 h-8" /> :
                        <Crown className="w-8 h-8" />}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-tighter">/{plan.duration} Days</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-gray-600 text-sm font-semibold leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full py-6 rounded-xl font-bold text-base transition-all duration-200 ${plan.popular
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                    : "bg-white border-2 border-gray-100 text-gray-900 hover:bg-gray-50"
                    }`}
                  onClick={() => handleBookPlan(plan)}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Dashboard Modal */}
      {showBookingModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-900 leading-none">Checkout Details</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Plan Activation</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBookingModal(false)}
                  className="rounded-full hover:bg-gray-100 text-gray-400"
                  disabled={bookingLoading}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Plan Summary */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Selected Plan</p>
                    <p className="text-xl font-black text-gray-900">{selectedPlan.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Validity</p>
                    <p className="text-sm font-bold text-gray-700">{selectedPlan.duration} Days</p>
                  </div>
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Amount</p>
                    <p className="text-3xl font-black text-gray-900 italic">₹{selectedPlan.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</p>
                    <p className="text-emerald-600 text-xs font-black uppercase tracking-tighter flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Payment
                    </p>
                  </div>
                </div>
              </div>

              {/* Included features details */}
              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Included Features
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedPlan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBookingModal(false)}
                className="rounded-xl border-gray-200 font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition-all shadow-sm"
                disabled={bookingLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProceedToPayment}
                className="px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Pay
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}