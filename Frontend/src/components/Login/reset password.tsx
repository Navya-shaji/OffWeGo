import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/user/LoginService";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(email, password);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-md border border-gray-300 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter and confirm your new password to continue.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50"
        />

        <button
          onClick={handleSubmit}
          className={`w-full text-white font-semibold py-2 rounded transition duration-200 ${
            password && confirmPassword
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!password || !confirmPassword}
        >
          Reset Password
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Make sure your password is strong and secure.
        </p>
      </div>
    </div>
  );
}
