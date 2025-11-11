import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import type { Booking } from "@/interface/Boooking";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<Booking>();
  const location = useLocation();

  const data = location.state.booking;
  useEffect(() => {
    if (data) {
      setBookingDetails({
        ...data.data,
        paymentIntentId: data.payment_id,
        paymentStatus: data.paymentStatus,
      });
    }
  }, [data]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800">
        <div className="bg-white rounded-xl shadow-2xl p-10 text-center max-w-md w-full">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirming Your Booking
          </h2>
          <p className="text-gray-600">
            Please wait while we process your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-red-800">
        <div className="bg-white rounded-xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Failed
          </h2>
          <p className="text-gray-600 mb-6">
            There was an issue confirming your booking. Please contact support.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  console.log(bookingDetails, "Deta");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-brp-5">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-2xl w-full">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your payment was successful and your booking is confirmed.
          </p>
        </div>

        {bookingDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Booking Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-semibold">
                  {bookingDetails.paymentIntentId}
                </span>
              </div>
              <div className="flex justify-between"></div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-semibold text-green-600 capitalize">
                  {bookingDetails.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">
                  ₹{bookingDetails.totalAmount}
                </span>
              </div>
            </div>
          </div>
        )}

      
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/bookings")}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
