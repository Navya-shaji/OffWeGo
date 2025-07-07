import React, { useState } from "react";
import { VerifyOtp } from "@/services/vendor/vendorService";
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vendorData: VendorSignupSchema;
}

const OtpVendorModal: React.FC<Props> = ({ isOpen, onClose, vendorData }) => {
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      await VerifyOtp(vendorData, otp);
      setIsVerified(true);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Email Verification</h2>

        {isVerified ? (
          <div className="text-center">
            <h3 className="text-green-600 font-semibold text-lg mb-2">OTP Verified</h3>
            <p className="text-gray-700 text-sm">
              Your account is under review. You will be able to log in once approved by the admin.
            </p>
          </div>
        ) : (
          <>
            <label className="block text-sm text-gray-600 mb-1">Enter OTP</label>
            <input
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpVendorModal;
