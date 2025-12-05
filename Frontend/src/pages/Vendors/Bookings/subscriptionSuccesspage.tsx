import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPaymentAndCreateBooking } from "@/services/Payment/stripecheckoutservice"; 

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const vendorId = localStorage.getItem("vendorId");
      const planId = localStorage.getItem("selectedPlanId"); 

      if (!sessionId || !vendorId || !planId) {
        alert("Missing payment details");
        return;
      }

      try {
        const response = await verifyPaymentAndCreateBooking({
          sessionId,
          vendorId,
          planId,
        });
console.log(response,"response")
        if (response.success) {
          navigate("/vendor/dashboard"); 
        } else {
          alert("Payment verification failed");
        }
      } catch (err) {
        console.error(err);
        alert("Error verifying payment");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2 text-gray-600">Verifying your subscription...</p>
    </div>
  );
};

export default PaymentSuccess;
