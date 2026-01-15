import { useEffect, useState } from "react";
import Header from "@/components/home/navbar/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home, MapPin, Receipt, Calendar, ArrowRight, Plane } from "lucide-react";
import { motion } from "framer-motion";

import type { Booking, PackageInfo } from "@/interface/Boooking";

interface ExtendedBookingSuccess extends Omit<Partial<Booking>, 'paymentStatus' | 'selectedPackage'> {
  packageName?: string;
  amount?: number;
  paymentIntentId?: string;
  paymentStatus?: string;
  selectedPackage?: Partial<PackageInfo> & { name?: string };
}

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState<ExtendedBookingSuccess | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Simulate loading for better UX or validate data
    const timer = setTimeout(() => {
      const state = location.state;

      if (state?.booking) {
        // Handle various data structures (wrapped in .data or direct)
        const bookingRaw = state?.booking;
        const bookingData = bookingRaw?.data || bookingRaw;

        if (!bookingData) {
          setStatus("error");
          return;
        }

        // Extract payment ID from state or booking data
        const pId = state.paymentIntentId || bookingData.paymentIntentId || (state.bookingId);

        setBookingDetails({
          ...bookingData,
          paymentIntentId: pId,
          paymentStatus: bookingData.paymentStatus || 'succeeded',
        });
        setStatus("success");
      } else {
        // Fallback for debugging - check if we have query params (Stripe redirect)
        const params = new URLSearchParams(location.search);
        const payment_intent = params.get("payment_intent");

        if (payment_intent) {
          // In a real app, we would fetch booking by payment_intent here.
          // For now, show partial success or error.
          setStatus("error"); // Or fetch data
        } else {
          setStatus("error");
        }
      }
    }, 1000); // 1s delay
    return () => clearTimeout(timer);
  }, [location.state, location.search]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-8"
        >
          <Plane className="w-12 h-12 text-teal-600" />
        </motion.div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Finalizing Your Adventure...</h2>
        <p className="text-slate-500 font-medium">Securing your spots and issuing tickets.</p>
      </div>
    );
  }

  // If error, show friendly message but allow navigation
  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Header forceSolid />
        <div className="bg-white rounded-[2rem] shadow-xl p-10 max-w-md w-full text-center border border-slate-100 mt-20">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-rose-500 opacity-50" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Trip Confirmed!</h2>
          <p className="text-slate-500 mb-8 font-medium">
            Your booking was successful, but we couldn't display the ticket details right now. Check your "My Bookings" page.
          </p>
          <button
            onClick={() => navigate("/bookings")}
            className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const { selectedPackage, totalAmount, paymentIntentId } = bookingDetails || {};
  // Handle case where specific fields might be deeper or named differently
  const destinationName = selectedPackage?.name || bookingDetails?.packageName || "Your Trip";
  const amount = totalAmount || bookingDetails?.amount || 0;
  const travelersCount = (bookingDetails?.adults?.length || 0) + (bookingDetails?.children?.length || 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 pt-24 pb-12 px-4">
      <Header forceSolid />

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative"
        >
          {/* Decorative Top */}
          <div className="bg-teal-600 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_2px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <CheckCircle className="w-12 h-12 text-teal-600" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">Booking Confirmed!</h1>
            <p className="text-teal-100 font-medium text-lg">Get ready for {destinationName}</p>
          </div>

          {/* Ticket Body */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b-2 border-dashed border-slate-100 pb-8 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</p>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-500" /> {destinationName}
                </h3>
              </div>
              <div className="space-y-1 text-right md:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking ID</p>
                <p className="text-lg font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg inline-block md:block">
                  #{paymentIntentId ? String(paymentIntentId).slice(-8).toUpperCase() : "CONFIRMED"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Calendar className="w-6 h-6 text-teal-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                <p className="font-bold text-gray-900">
                  {bookingDetails?.selectedDate ? new Date(bookingDetails.selectedDate).toLocaleDateString() : "Flexible"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Receipt className="w-6 h-6 text-purple-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase">Total Paid</p>
                <p className="font-bold text-gray-900">₹{amount.toLocaleString()}</p>
              </div>
              <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Plane className="w-6 h-6 text-rose-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase">Travelers</p>
                <p className="font-bold text-gray-900">
                  Total {travelersCount || 1}
                  <span className="text-slate-400 text-sm font-normal ml-1">
                    People  {(bookingDetails?.adults?.length || 0) > 0 ? `(${bookingDetails?.adults?.length} Adults)` : ''}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate("/bookings")}
                className="flex-1 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                View My Bookings <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" /> Return Home
              </button>
            </div>
          </div>

          {/* Receipt Tear Effect */}
          <div className="absolute top-[380px] -left-3 w-6 h-6 bg-slate-50 rounded-full hidden md:block"></div>
          <div className="absolute top-[380px] -right-3 w-6 h-6 bg-slate-50 rounded-full hidden md:block"></div>

        </motion.div>
      </div>
    </div>
  );
}
