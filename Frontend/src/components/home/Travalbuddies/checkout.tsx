import { createBooking } from "@/services/Booking/bookingService";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CheckoutForm({ amount }: { amount: number; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const bData = location.state?.bookingData;
 const start = new Date(bData.startDate);
const end = new Date(bData.endDate);
const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
console.log(duration,"du")
  if (!elements || !bData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        try {
          const bookingPayload = {
            packageId: bData.packageId,
            userId: bData.userId,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            title: bData.title,
            destination: bData.destination,
              duration,
            startDate: bData.startDate,
            endDate: bData.endDate,
          };
console.log("Booking Payload:", bookingPayload);
console.log("Duration:", duration);
          const result = await createBooking(bookingPayload, paymentIntent.id);
          
          navigate("/payment-success", {
            state: {
              booking: result.booking || result,
              paymentIntent: paymentIntent,
            },
          });
        } catch (bookingError: any) {
          console.error("Booking creation failed:", bookingError);
          setErrorMessage(
            bookingError.message || 
            "Payment succeeded but booking failed. Please contact support with your payment ID: " + 
            paymentIntent.id
          );
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By confirming your payment, you agree to our terms and conditions.
      </p>
    </form>
  );
}

export default CheckoutForm