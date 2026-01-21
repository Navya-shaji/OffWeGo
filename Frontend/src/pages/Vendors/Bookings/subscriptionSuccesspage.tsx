import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPaymentAndCreateBooking } from "@/services/Payment/stripecheckoutservice";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your subscription...");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const vendorId = localStorage.getItem("vendorId");
      const planId = localStorage.getItem("selectedPlanId");

      if (!sessionId || !vendorId || !planId) {
        setStatus("error");
        setMessage("Missing payment details. Please contact support.");
        toast.error("Missing payment details");
        setTimeout(() => {
          navigate("/vendor/subscriptionplans");
        }, 3000);
        return;
      }

      try {
        const response = await verifyPaymentAndCreateBooking({
          sessionId,
          vendorId,
          planId,
        });


        if (response.success) {
          setStatus("success");
          setMessage("Payment verified successfully! Redirecting to dashboard...");
          toast.success("Subscription activated successfully!");

          localStorage.removeItem("vendorId");
          localStorage.removeItem("selectedPlanId");

          setTimeout(() => {
            navigate("/vendor/profile");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(response.message || "Payment verification failed");
          toast.error(response.message || "Payment verification failed");
        }
      } catch (error: unknown) {
        setStatus("error");
        const errorMessage = error instanceof Error ? error.message : "Error verifying payment";
        setMessage(errorMessage);
        toast.error(errorMessage);

        setTimeout(() => {
          navigate("/vendor/subscriptionplans");
        }, 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate("/vendor/subscriptionplans")}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-bold"
            >
              Back to Subscription Plans
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
