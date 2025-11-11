import { useState, useRef } from "react";
import { verifyOtpForReset } from "@/services/user/LoginService";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import ResetPasswordModal from "./reset password";
import { Link } from "react-router-dom";

interface VerifyResetOtpModalProps {
  email: string;
  onClose: () => void;
}

export default function VerifyResetOtpModal({
  email,
  onClose,
}: VerifyResetOtpModalProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async () => {
    const joinedOtp = otp.join("");
    if (joinedOtp.length < 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    try {
      await verifyOtpForReset(email, joinedOtp);
      toast.success("OTP verified successfully!");
      setShowResetPasswordModal(true);
    } catch (error) {
      toast.error("Invalid or expired OTP");
      console.error(error);
    }
  };

  if (showResetPasswordModal) {
    return (
      <ResetPasswordModal
        email={email}
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-[380px] bg-white border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col items-center animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-8 text-center">
          Verification
        </h2>

        <p className="text-sm font-semibold text-gray-700 mb-6 text-center">
          Enter Verification Code
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleBackspace(index, e)}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-8">
          If you didn't receive a code,{" "}
          <span className="text-red-500 cursor-pointer hover:underline">
            Resend
          </span>
        </p>

        <button
          onClick={handleSubmit}
          disabled={otp.some((digit) => digit === "")}
          className={`w-full font-medium py-3 rounded-full transition-all duration-200 ${
            otp.every((digit) => digit !== "")
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Verify
        </button>

        <div className="mt-8 w-full text-center">
          <p className="text-xs text-gray-400 mb-2">Do you have an account?</p>
          <Link
            to="/signup"
            className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-full hover:bg-gray-50 transition-all duration-200 block"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
