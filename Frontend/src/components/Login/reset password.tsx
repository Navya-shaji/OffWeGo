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
      console.log(error);
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter New Password"
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        className="w-full p-2 border rounded mb-4"
      />

      <button onClick={handleSubmit} className="w-full bg-black text-white p-2 rounded">
        Reset Password
      </button>
    </div>
  );
}
