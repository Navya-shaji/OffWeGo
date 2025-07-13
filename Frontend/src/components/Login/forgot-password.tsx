import { useState } from "react";
import toast from "react-hot-toast";
import { sendOtpForReset } from "@/services/user/LoginService";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await sendOtpForReset(email);
      toast.success("OTP sent to your email");
      navigate(`/verify-reset-otp?email=${email}`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
        console.error(err.message);
      } else {
        toast.error("Unknown error occurred");
        console.error("Unknown error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your registered email to receive a reset OTP.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition duration-200"
        >
          Send OTP
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Make sure to check your spam folder if you don’t receive it.
        </p>
      </div>
    </div>
  );
}
