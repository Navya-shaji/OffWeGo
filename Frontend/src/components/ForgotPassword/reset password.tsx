import { useState } from "react";
import { resetPassword } from "@/services/user/LoginService";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResetPasswordModalProps {
  email: string;
  onClose: () => void;
}

export default function ResetPasswordModal({ email, onClose }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(email, password);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        onClose();
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

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
          Reset Password
        </h2>

        <p className="text-sm font-semibold text-gray-700 mb-6 text-center">
          Enter and confirm your new password
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded-full px-4 py-2 mb-6 text-sm placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleSubmit}
          disabled={!password || !confirmPassword}
          className={`w-full font-medium py-3 rounded-full transition-all duration-200 ${password && confirmPassword
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Reset Password
        </button>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Make sure your password is strong and secure.
        </p>
      </div>
    </div>
  );
}