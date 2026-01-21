import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("Payment failed. Please try again.");

  useEffect(() => {
    const error = location.state?.error;
    if (error) {
      setErrorMessage(error);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          {errorMessage || "We were unable to process your payment."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-bold"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/vendor/profile")}
            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
