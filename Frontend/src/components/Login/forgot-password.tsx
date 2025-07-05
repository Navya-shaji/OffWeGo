import { useState } from "react";
import toast from "react-hot-toast";
import { sendOtpForReset } from "@/services/user/LoginService";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Handle submit")
    try {
      await sendOtpForReset(email);
      toast.success("OTP sent to your email");
     navigate(`/verify-reset-otp?email=${email}`);

    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Unknown error");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send OTP
      </button>
    </div>
  );
}
