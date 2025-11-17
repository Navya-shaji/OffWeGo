import { useState } from "react";
import { Wallet, CreditCard as StripeIcon, Lock, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import StripeCheckout from "./stripeCheckout";

export default function PaymentCheckout() {
  const { state } = useLocation();
  const totalAmount = state?.totalAmount || 0;
 const navigate=useNavigate()
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  const subtotal = totalAmount;

console.log(subtotal,"slkdslkd")

  const handlePayment = () => {
    if (selectedPayment === "stripe") {
      setShowStripeCheckout(true);
    } else if (selectedPayment === "wallet") {
      alert("Processing wallet payment...");
    }
  };

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
                  onClick={() => setSelectedPayment("stripe")}
                  className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border-2 text-center font-medium transition-all duration-300 ${
                    selectedPayment === "stripe"
                      ? "border-black bg-gray-50 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                    <StripeIcon className="h-6 w-6" />
                  </div>
                  <span>Stripe (Card Payment)</span>
                </button>

                {/* Wallet */}
                <button
                  onClick={() => setSelectedPayment("wallet")}
                  className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border-2 text-center font-medium transition-all duration-300 ${
                    selectedPayment === "wallet"
                      ? "border-black bg-gray-50 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <span>My Wallet</span>
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
                  <p>
                    <strong>My Wallet:</strong> Use your OffWeGo wallet balance
                    for instant payment.
                  </p>
                )}
              </div>
            </div>

          
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

        
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Summary
              </h3>

             
              <div className="space-y-3 mb-6 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal}
                  </span>
                </div>
                
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="font-semibold text-lg text-gray-800">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{subtotal}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={totalAmount === 0}
                className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-white ${
                  totalAmount === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-black via-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
                }`}
              >
                <span>Pay ₹{subtotal}</span>
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
              </button>

              
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
