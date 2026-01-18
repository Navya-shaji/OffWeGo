import { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPayment } from "@/services/Payment/PaymentService";
import { createBooking } from "@/services/Booking/bookingService";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const bData = location.state?.bookingData;

  useEffect(() => {
    if (!bData) {
      toast.error("Booking data not found. Please try again.");
      navigate(-1);
    }
  }, [bData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please wait a moment.");
      return;
    }

    if (!bData) {
      toast.error("Booking data not found. Please try again.");
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
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message || "Payment failed");
          toast.error(error.message || "Payment failed");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          toast.error("An unexpected error occurred. Please try again.");
        }
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful! Creating your booking...");

        try {
          const result = await createBooking(bData, paymentIntent.id);

          toast.success("Booking created successfully!");

          navigate("/payment-success", {
            state: {
              booking: result.data || result,
              paymentIntentId: paymentIntent.id,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (bookingError: any) {
          console.error("Booking creation failed:", bookingError);

          const errorMsg =
            bookingError.response?.data?.message ||
            bookingError.response?.data?.error ||
            bookingError.message ||
            "Booking creation failed. Please contact support.";

          toast.error(errorMsg);

          navigate("/payment-failed", {
            state: {
              booking: null,
              paymentIntentId: paymentIntent.id,
              error: errorMsg,
            },
          });
        }
      } else if (paymentIntent?.status === "processing") {
        toast("Payment is processing. You'll receive confirmation shortly.", { icon: "ℹ️" });
        navigate("/payment-processing");
      } else if (paymentIntent?.status === "requires_payment_method") {
        setErrorMessage("Payment failed. Please try a different payment method.");
        toast.error("Payment failed. Please try a different payment method.");
        navigate("/payment-failed", {
          state: {
            paymentIntentId: paymentIntent?.id,
            error: "Payment failed. Please try again.",
          },
        });
      } else {
        setErrorMessage(`Payment status: ${paymentIntent?.status || "unknown"}`);
        toast.error("Payment could not be completed. Please try again.");
        navigate("/payment-failed", {
          state: {
            paymentIntentId: paymentIntent?.id,
            error: "Payment could not be completed. Please try again.",
          },
        });
      }
    } catch {
      setErrorMessage("An error occurred during payment");
      toast.error("An error occurred during payment");
      navigate("/payment-failed", {
        state: {
          paymentIntentId: null,
          error: "An error occurred during payment",
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };


  if (!elements) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading payment form...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing Payment...
          </>
        ) : (
          `Pay ₹${amount.toLocaleString()}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

export default function StripeCheckout({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#000000",
        },
      },
    }),
    [clientSecret]
  );

  useEffect(() => {
    if (!clientSecret && amount > 0) {
      createPayment(amount, "inr")
        .then((data) => {
          const secret = data.client_secret || data.payment?.clientSecret;
          if (secret) {
            setClientSecret(secret);
            setLoading(false);
          } else {
            throw new Error("No client secret received");
          }
        })
        .catch((error) => {
          console.error("Payment initialization error:", error);
          setError(error.message || "Failed to initialize payment");
          toast.error("Failed to initialize payment. Please try again.");
          setLoading(false);
        });
    }
  }, [amount, clientSecret]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
        <p className="mt-6 text-gray-600 font-medium">Initializing secure payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700 font-semibold mb-2">Payment Error</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry Payment
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-yellow-700">Failed to load payment form</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> If you're using an ad blocker, please disable it for this page to complete the payment.
        </p>
      </div>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm amount={amount} />
      </Elements>
    </div>
  );
}