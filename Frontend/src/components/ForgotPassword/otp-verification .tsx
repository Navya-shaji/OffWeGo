import { useState, useEffect } from "react";
import { verifyOtpForReset, sendOtpForReset } from "@/services/user/LoginService";
import toast from "react-hot-toast";
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
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          toast.error("OTP expired. Please resend.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.getElementById("otp-0")?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);

      const nextIndex = Math.min(pasteData.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
    }
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
      console.error(error);
    }
  };

  const handleResend = async () => {
    try {
      toast.loading("Resending OTP...");
      await sendOtpForReset(email);
      toast.dismiss();
      toast.success("OTP resent successfully");
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  if (showResetPasswordModal) {
    return <ResetPasswordModal email={email} onClose={onClose} />;
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="bg-orange-100 p-5 pb-12 relative rounded-b-[60%] text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify OTP</h2>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            className="w-20 h-20 mx-auto"
            alt="OTP Icon"
          />
        </div>

        <div className="p-8 -mt-8 text-center">
          <p className="text-sm text-gray-600 mb-6">
            We sent a 6-digit verification code to your email.
          </p>
          <div className="flex justify-between gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={timeLeft === 0}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Verify
          </button>
          <p className="text-sm mt-4 text-gray-500">
            OTP expires in: <strong>{formatTime(timeLeft)}</strong>
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Didn't receive the code?{" "}
            <span
              className={`cursor-pointer ${timeLeft === 0 ? "text-black font-semibold hover:underline" : "text-gray-400"}`}
              onClick={timeLeft === 0 ? handleResend : undefined}
            >
              Resend
            </span>
          </p>
          <div className="mt-8">
            <p className="text-xs text-gray-400 mb-2">Remember your password?</p>
            <Link
              to="/login"
              className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition block"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
