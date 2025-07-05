import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyOtpForReset } from "@/services/user/LoginService";
import toast from "react-hot-toast";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (!queryEmail) {
      toast.error("Email is missing from the URL");
    }
    setEmail(queryEmail);  // set null or string
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email not found. Cannot verify OTP.");
      return;
    }

    try {
      console.log("Verifying OTP with:", { email, otp });  // Debug
      await verifyOtpForReset(email, otp);
      toast.success("OTP verified");
      navigate(`/reset-password?email=${email}`);
    } catch (error) {
      console.log(error)
      toast.error("Invalid or expired OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white p-2 rounded"
        disabled={!otp || !email}
      >
        Verify OTP
      </button>
    </div>
  );
}
