import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resendOtp, VerifyOtp } from "@/services/user/userService";
import type { SignupSchema } from "@/Types/User/auth/Tsignup";

export default function OtpModal({  isOpen, onClose, userData,}: {
  isOpen: boolean;
  onClose: () => void;
  userData: SignupSchema;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

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

  const handleSubmit = async () => {
    const fullOtp = otp.join("");
    try {
      const res = await VerifyOtp(userData, fullOtp);
      if (res.data.success) {
        toast.success("OTP Verified");
        navigate("/home");
      } else {
        toast.error("Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      toast.loading("Resending OTP...");
      await resendOtp(userData.email);
      toast.dismiss();
      toast.success("OTP resent successfully");
      setTimeLeft(60);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  if (!isOpen) return null;

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
          />
        </div>

        <div className="p-8 -mt-8">
          <p className="text-sm text-center text-gray-600 mb-6">
            We sent a 6-digit code to your email.
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
                className="w-12 h-14 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg"
            disabled={timeLeft === 0}
          >
            Submit
          </button>
          <p className="text-sm text-center mt-4 text-gray-500">
            OTP expires in: <strong>{formatTime(timeLeft)}</strong>
          </p>
          <p className="text-xs text-center mt-2 text-gray-500">
            Didn’t receive the code?{" "}
            <span
              className={`cursor-pointer ${
                timeLeft === 0 ? "text-black hover:underline" : "text-gray-400"
              }`}
              onClick={timeLeft === 0 ? handleResend : undefined}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
