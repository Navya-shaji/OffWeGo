import { VerifyOtp } from "@/services/user/userService";
import type { SignupSchema } from "@/Types/User/auth/Tsignup";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function OtpModal({ isOpen, onClose,userData }: { isOpen: boolean; onClose: () => void;userData:SignupSchema}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate=useNavigate()
  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const fullOtp = otp.join("");
    console.log("OTP Entered:", fullOtp);
    VerifyOtp(userData,fullOtp)
    toast.success("OTP Verified")
    navigate("/home",{replace:true})
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
        <h2 className="text-xl font-semibold text-center mb-4">Enter 6-Digit OTP</h2>
        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-10 h-12 text-center border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Verify OTP
        </button>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
