import { useState, useEffect, useMemo } from 'react'; // ← Add useEffect
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { createPayment } from '@/services/Payment/PaymentService'; 
import { createBooking } from '@/services/Booking/bookingService';
import { useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount ,clientSecret}: { amount: number,clientSecret:string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()
  const location=useLocation()
 const bData=location.state.bookingData
//  console.log(JSON.stringify(bData),"travaler")
console.log(JSON.stringify(bData))
  if(!elements) return null
const cardElement = elements.getElement(CardElement);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

  const { error, paymentIntent } = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: window.location.origin + '/payment-success' },
  redirect: 'if_required',
});

if (!error && paymentIntent?.status === 'succeeded') {
  try {
    console.log("heyyy",paymentIntent.id)
  const result =  await createBooking(bData,paymentIntent.id); // send your booking data
   navigate('/booking-success',{state:{
   booking: result.booking
   }})
  } catch (bookingError) {
    console.error('Booking creation failed:', bookingError);
  }finally{
  setIsProcessing(false)

  }
}



    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setIsProcessing(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-600 text-sm">{errorMessage}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </form>
  );
}

export default function StripeCheckout({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 const options = useMemo(() => ({ clientSecret }), [clientSecret]);

useEffect(() => {
  if (!clientSecret) {
    createPayment(amount, 'inr')
      .then((data) => {
        setClientSecret(data.client_secret || data.payment.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message || 'Failed to initialize payment');
        setLoading(false);
      });
  }
}, [amount, clientSecret]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading payment form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return <div className="text-center py-8 text-red-600">Failed to load payment form</div>;
  }

return (
  <Elements stripe={stripePromise} options={options}>
    <CheckoutForm amount={amount} clientSecret={clientSecret} />
  </Elements>
);

}