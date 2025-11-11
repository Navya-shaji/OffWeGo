import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import BuddyTravelCheckoutForm from "@/components/home/Travalbuddies/buddyTravelCheckout";
import { createPayment } from "@/services/Payment/PaymentService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function BuddyTravelPaymentPage() {
  const location = useLocation();
  const buddyTravelData = location.state?.buddyTravelData;
  const amount = location.state?.amount || 0;

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!amount) return;

    (async () => {
      try {
        // ✅ Use service function here
        const data = await createPayment(amount * 100, "inr"); 
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [amount]);

  if (loading) return <p className="text-center py-8">Initializing payment...</p>;
  if (!clientSecret) return <p className="text-center py-8 text-red-500">Failed to start payment</p>;

  const options = { clientSecret, appearance: { theme: "stripe" as const } };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        <Elements stripe={stripePromise} options={options}>
          <BuddyTravelCheckoutForm amount={amount} clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
}
