import { useState, useEffect } from "react";
import { Wallet, CreditCard, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import StripeCheckout from "./stripeCheckout";
import { getUserWallet, createBookingWithWallet } from "@/services/Wallet/UserWalletService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function PaymentCheckout() {
  const { state } = useLocation();
  const totalAmount = state?.totalAmount || 0;
  
  
  const navigate = useNavigate();
  
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  const subtotal = totalAmount;

  const UserId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setUserId(UserId || '');
        
        if (UserId) {
          const walletData = await getUserWallet(UserId);
          setWalletBalance(walletData.balance || 0);
        }
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
        setError("Unable to load wallet balance");
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWallet();
  }, [UserId]);

  const handleWalletPayment = async () => {
    if (walletBalance < subtotal) {
      setError(`Insufficient wallet balance. You need ₹${subtotal - walletBalance} more.`);
      return;
    }

    setPaymentLoading(true);
    setError("");

    try {
      // Get booking data from state (passed from previous page)
      const bookingData = state?.bookingData;
      
      if (!bookingData) {
        throw new Error("Booking data is missing. Please go back and try again.");
      }

 const response = await createBookingWithWallet(
  userId,       
  subtotal,   
  bookingData,  
  "Booking payment"
);


   

      if (response.success) {
        setWalletBalance(prev => prev - subtotal);

        alert("Payment successful! Your booking is confirmed.");

        navigate("/booking-success", {
          state: {
            paymentMethod: "wallet",
            amount: subtotal,
            bookingId: response.bookingId || response.data?.bookingId,
            booking: response.data,
          },
        });
      } else {
        throw new Error(response.message || "Payment failed");
      }
    } catch (error) {
      console.error("Wallet payment failed:", error);
      setError(
        error instanceof Error 
          ? error.message 
          : "Payment failed. Please try again or use another payment method."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayment = () => {
    if (selectedPayment === "stripe") {
      setShowStripeCheckout(true);
    } else if (selectedPayment === "wallet") {
      handleWalletPayment();
    }
  };

  const hasInsufficientBalance = selectedPayment === "wallet" && walletBalance < subtotal;
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-gray-600 text-sm">
            Secure and quick payment for your booking
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-lg font-semibold mb-6 text-gray-900">
                Choose Your Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Stripe */}
                <button
                  onClick={() => {
                    setSelectedPayment("stripe");
                    setError("");
                  }}
                  className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border-2 text-center font-medium transition-all duration-300 ${
                    selectedPayment === "stripe"
                      ? "border-black bg-gray-50 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <span>Stripe (Card Payment)</span>
                </button>

                {/* Wallet */}
                <button
                  onClick={() => {
                    setSelectedPayment("wallet");
                    setError("");
                  }}
                  disabled={walletLoading}
                  className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border-2 text-center font-medium transition-all duration-300 relative ${
                    selectedPayment === "wallet"
                      ? "border-black bg-gray-50 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  } ${walletLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <span>My Wallet</span>
                  {!walletLoading && (
                    <span className="text-xs text-gray-500 mt-1">
                      Balance: ₹{walletBalance.toFixed(2)}
                    </span>
                  )}
                  {walletLoading && (
                    <span className="text-xs text-gray-400">Loading...</span>
                  )}
                </button>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-2xl text-sm text-gray-600">
                {selectedPayment === "stripe" && (
                  <p>
                    <strong>Stripe:</strong> International payment gateway for
                    secure card payments.
                  </p>
                )}
                {selectedPayment === "wallet" && (
                  <div>
                    <p className="mb-2">
                      <strong>My Wallet:</strong> Use your OffWeGo wallet balance
                      for instant payment.
                    </p>
                    {!walletLoading && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span>Current Balance:</span>
                          <span className="font-semibold">₹{walletBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Payment Amount:</span>
                          <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-300">
                          <span className="font-medium">After Payment:</span>
                          <span className={`font-semibold ${
                            walletBalance - subtotal < 0 ? "text-red-600" : "text-green-600"
                          }`}>
                            ₹{(walletBalance - subtotal).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stripe Checkout Modal */}
            {showStripeCheckout && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Complete Payment
                  </h2>
                  <StripeCheckout amount={subtotal} />
                  <button
                    onClick={() => setShowStripeCheckout(false)}
                    className="mt-6 w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Summary
              </h3>

              <div className="space-y-3 mb-6 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="font-semibold text-lg text-gray-800">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={totalAmount === 0 || paymentLoading || hasInsufficientBalance}
                className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-white ${
                  totalAmount === 0 || paymentLoading || hasInsufficientBalance
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-black via-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
                }`}
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{subtotal.toFixed(2)}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>

              {hasInsufficientBalance && (
                <p className="mt-3 text-xs text-red-600 text-center">
                  Insufficient wallet balance
                </p>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="h-4 w-4" />
                <span>100% Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}