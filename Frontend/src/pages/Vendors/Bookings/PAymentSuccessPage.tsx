import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPaymentAndCreateBooking } from "@/services/Payment/stripecheckoutservice";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your payment...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const bookingDetails = JSON.parse(sessionStorage.getItem("bookingDetails") || "{}");

      if (!sessionId || !bookingDetails.vendorId || !bookingDetails.planId) {
        setMessage("⚠️ Missing session or booking details.");
        setLoading(false);
        return;
      }

      try {
        const response = await verifyPaymentAndCreateBooking({
          sessionId,
          vendorId: bookingDetails.vendorId,
          planId: bookingDetails.planId,
        });

        if (response.success) {
          setMessage("✅ Payment verified successfully!");
          setTimeout(() => navigate("/profile"), 2000);
        } else {
          setMessage("❌ Payment verification failed.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setMessage("❌ Error verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{loading ? "Processing..." : "Payment Status"}</h2>
      <p>{message}</p>
    </div>
  );
};

export default PaymentSuccessPage;
