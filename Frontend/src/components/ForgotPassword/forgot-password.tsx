import { useState } from "react";
import toast from "react-hot-toast";
import { sendOtpForReset } from "@/services/user/LoginService";
import { Link } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import VerifyResetOtpModal from "./otp-verification ";

export default function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await sendOtpForReset(trimmedEmail);

      if (response?.success) {
        toast.success(response.message || "OTP sent to your email");
        setShowVerifyModal(true);
      }
    } catch {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  if (showVerifyModal) {
    return <VerifyResetOtpModal email={email} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-[400px] bg-white border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col items-center animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-800 text-center">
          Forgot Password
        </h2>

        <p className="text-sm font-semibold text-gray-800 mb-2 text-center">
          Enter Email Address
        </p>

        <input
          type="email"
          placeholder="example@gmail.com"
          className="w-full border border-gray-400 rounded-full px-4 py-2 mb-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Link
          to="/login"
          className="text-xs text-gray-400 mb-3 hover:text-gray-600 transition"
        >
          Back to sign in
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white font-medium py-2 rounded-full mb-6 hover:bg-gray-800 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin mr-2" size={18} />
              Sending...
            </div>
          ) : (
            "Send"
          )}
        </button>

        <p className="text-xs text-gray-400 mb-2">Do you have an account?</p>

        <Link
          to="/signup"
          className="w-full border border-gray-400 text-gray-700 font-medium py-2 rounded-full text-center hover:bg-gray-50 transition duration-200"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
