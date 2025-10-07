import { useState } from "react";
import { CreditCard, Wallet, CreditCard as StripeIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import StripeCheckout from "./stripeCheckout";

export default function PaymentCheckout() {
  
  const { state } = useLocation();
  const totalAmount = state?.totalAmount || 0;

  
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
 
  const [orderNotes, setOrderNotes] = useState("");

  const subtotal = totalAmount;
  const finalAmount = totalAmount - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      const discountAmount = Math.floor(totalAmount * 0.1);
      setDiscount(discountAmount);
      alert(`Coupon applied! You saved ₹${discountAmount}`);
    } else if (couponCode) {
      alert("Invalid coupon code!");
    }
  };
const handlePayment = () => {
  if (selectedPayment === "stripe") {
    // Show Stripe payment modal/component
    setShowStripeCheckout(true);
  } else if (selectedPayment === "razorpay") {
    // Razorpay logic
    alert("Redirecting to Razorpay payment gateway...");
  } else if (selectedPayment === "wallet") {
    // Wallet logic
    alert("Processing wallet payment...");
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedPayment("razorpay")}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border-2 transition-all ${
                    selectedPayment === "razorpay"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Razorpay</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("stripe")}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border-2 transition-all ${
                    selectedPayment === "stripe"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <StripeIcon className="w-5 h-5" />
                  <span className="font-medium">Stripe</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("wallet")}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-lg border-2 transition-all ${
                    selectedPayment === "wallet"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">My Wallet</span>
                </button>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                {selectedPayment === "razorpay" && (
                  <p className="text-sm text-gray-600">
                    <strong>Razorpay:</strong> Pay securely using Credit/Debit Cards, Net Banking, UPI, and Wallets.
                  </p>
                )}
                {selectedPayment === "stripe" && (
                  <p className="text-sm text-gray-600">
                    <strong>Stripe:</strong> International payment gateway supporting Credit/Debit Cards worldwide.
                  </p>
                )}
                {selectedPayment === "wallet" && (
                  <p className="text-sm text-gray-600">
                    <strong>My Wallet:</strong> Use your OffWeGo wallet balance for instant payment.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Notes about your order, e.g. special notes for delivery"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            {showStripeCheckout && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
      <StripeCheckout amount={finalAmount} />
      <button
        onClick={() => setShowStripeCheckout(false)}
        className="mt-4 text-gray-600 hover:text-black"
      >
        Cancel
      </button>
    </div>
  </div>
)}
          </div>


          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-6 pb-6 border-b border-gray-200">
                <span className="font-semibold text-lg">Total</span>
                <span className="text-2xl font-bold">₹{finalAmount}</span>
              </div>

       
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Try: SAVE10 for 10% off</p>
              </div>

           
              <button
                onClick={handlePayment}
                disabled={totalAmount === 0}
                className={`w-full py-4 bg-black text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  totalAmount === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <span>Proceed to Pay ₹{finalAmount}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

           
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      
    </div>
  );
}