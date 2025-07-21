import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { verifyOtpForReset } from "@/services/user/LoginService";
import toast from "react-hot-toast";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (!queryEmail) toast.error("Email is missing from the URL");
    setEmail(queryEmail);
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; 
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email not found.");
      return;
    }

    const joinedOtp = otp.join("");
    if (joinedOtp.length < 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    try {
      await verifyOtpForReset(email, joinedOtp);
      toast.success("OTP verified");
      navigate(`/reset-password?email=${email}`);
    } catch (error) {
      toast.error("Invalid or expired OTP");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the 6-digit OTP sent to your email.
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-between mb-6">
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
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={otp.some((digit) => digit === "") || !email}
          className={`w-full text-white font-semibold py-2 rounded transition duration-200 ${
            otp.every((digit) => digit !== "") && email
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Verify OTP
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Didn’t receive it? Check spam or try again.
        </p>
      </div>
    </div>
  );
}
