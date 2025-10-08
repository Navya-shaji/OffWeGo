// import React, { useState } from "react";
// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { createBooking } from "@/services/Booking/bookingService"; 
// import type { RootState } from "@/store/store";
// import toast from "react-hot-toast";

// const cardElementOptions = {
//   style: {
//     base: {
//       fontSize: "16px",
//       color: "#32325d",
//       "::placeholder": { color: "#a0aec0" },
//     },
//     invalid: { color: "#e53e3e" },
//   },
// };

// export default function CheckoutForm({ clientSecret, amount, bookingData }: { clientSecret: string; amount: number; bookingData: any }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.auth.user);

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState<null | string>(null);

//   if (!user) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     setErrorMsg("");
//     setPaymentStatus("Processing...");

//     const cardElement = elements.getElement(CardElement);

//     try {
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardElement!,
//         },
//       });

//       console.log(result);

//       if (result.error) {
//         setErrorMsg(result.error.message || "Payment failed.");
//         setPaymentStatus("Payment Failed");
//       } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
//         try {
//           const bookedData = await createBooking(result.paymentIntent.id, user._id!, bookingData);
//           setPaymentStatus("Payment Successful");
//           toast.success("Booking successful");
//           navigate("/payment-success", {
//             replace: true,
//             state: { booking_id: bookedData.booking_id },
//           });
//         } catch (error) {
//           console.error(error);
//           setErrorMsg("Booking failed. Please contact support.");
//           setPaymentStatus("Payment Failed");
//         }
//       }
//     } catch (err: any) {
//       setErrorMsg(err.message || "An error occurred.");
//       setPaymentStatus("Payment Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Complete Your Payment</h2>

//         <div className="p-4 border rounded-md">
//           <CardElement options={cardElementOptions} />
//         </div>

//         <div className="text-xl font-semibold text-gray-700 text-right">Total: ₹{amount}</div>

//         {errorMsg && <div className="text-red-600 text-sm font-medium text-center">{errorMsg}</div>}

//         {paymentStatus && (
//           <div className={`text-center text-base font-bold ${
//             paymentStatus === "Payment Successful" ? "text-green-600" : "text-yellow-600"
//           }`}>
//             {paymentStatus}
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading || !stripe}
//           className={`w-full py-3 px-4 rounded-md text-white text-lg font-medium flex justify-center items-center transition duration-200 ${
//             loading || !stripe ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
//           }`}
//         >
//           {loading ? (
//             <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0A8 8 0 014 12z"></path>
//             </svg>
//           ) : (
//             "Pay Now"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }
