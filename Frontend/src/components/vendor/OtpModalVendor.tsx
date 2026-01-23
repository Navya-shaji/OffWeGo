import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VerifyOtp } from "@/services/vendor/vendorService";
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vendorData: VendorSignupSchema;
}

const OtpVendorModal: React.FC<Props> = ({ isOpen, onClose, vendorData }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isVerified) {
      document.getElementById("otp-0")?.focus();
    }
  }, [isOpen, isVerified]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isVerified) {
      interval = setInterval(async () => {
        try {
          const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/?$/, "/");
          const response = await fetch(
            `${baseURL}vendor/status?email=${vendorData.email}`
          );
          const data = await response.json();

          if (data.status === "approved") {
            clearInterval(interval);
            toast.success("Your account has been approved!");
            navigate("/vendor/login");
          }
        } catch (error) {
          console.error("Error checking vendor status:", error);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified, vendorData.email]);

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

  const handleVerifyOtp = async (fullCode?: string) => {
    const code = typeof fullCode === "string" ? fullCode : otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await VerifyOtp(vendorData, code);
      setIsVerified(true);
      toast.success("OTP Verified!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="bg-orange-100 p-5 pb-12 relative rounded-b-[60%] text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isVerified ? "Account Pending" : "Verify OTP"}
          </h2>
          <img
            src={isVerified ? "https://cdn-icons-png.flaticon.com/512/1161/1161490.png" : "https://cdn-icons-png.flaticon.com/512/4712/4712027.png"}
            className="w-20 h-20 mx-auto"
            alt="Status"
          />
        </div>

        <div className="p-8 -mt-8">
          {isVerified ? (
            <div className="text-center">
              <p className="text-gray-700 text-sm mb-4">
                Your account is currently under review by our administration team.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                <p className="text-blue-700 text-xs font-medium">
                  We'll notify you as soon as your profile is approved. You can then log in to start your journey with us.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-black text-white py-3 rounded-lg font-medium tracking-wide hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-center text-gray-600 mb-6">
                Verification code sent to <strong>{vendorData.email}</strong>
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
                    className="w-12 h-14 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                ))}
              </div>

              <button
                onClick={() => handleVerifyOtp()}
                disabled={loading || timeLeft === 0}
                className="w-full bg-black text-white py-3 rounded-lg font-medium tracking-wide hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  OTP expires in: <strong className="text-gray-900">{formatTime(timeLeft)}</strong>
                </p>
                {timeLeft === 0 && (
                  <button
                    onClick={() => {
                      // Add resend logic if available in vendorService
                      toast("Please request a new OTP from the signup page.", { icon: "ℹ️" });
                    }}
                    className="mt-2 text-sm text-blue-600 font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVendorModal;