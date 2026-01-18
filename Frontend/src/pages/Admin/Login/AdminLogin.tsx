import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { loginAdmin } from "@/store/slice/Admin/adminAuthSlice";
import {
  AdminloginSchema,
  type AdminLoginFormData,
} from "@/Types/Admin/Login/LoginzodSchema";
import { setToken } from "@/store/slice/Token/tokenSlice";

export default function AdminLogin() {
  const isAuthenticated = useAppSelector(
    (state) => state.adminAuth.isAuthenticated
  );

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminloginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    // Validate form before submission
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Call API through thunk
      const response = await dispatch(loginAdmin(data)).unwrap();

      if (response?.accessToken) {
        dispatch(setToken(response.accessToken));
        toast.success(`Welcome back! Admin login successful`);
        navigate("/admin/dashboard");
      } else {
        toast.error("Login failed: No access token received");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Admin login error:", err);

      let errorMessage = "Invalid email or password";

      if (err?.message) {
        if (err.message.includes("401") || err.message.includes("unauthorized")) {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (err.message.includes("404") || err.message.includes("not found")) {
          errorMessage = "Admin account not found.";
        } else if (err.message.includes("500") || err.message.includes("server error")) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[85vh] shadow-2xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        {/* Left Image */}
        <div
          className="md:w-1/2 h-64 md:h-full relative bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/Adminlogin.jpeg")' }}
        >
          <div className="absolute inset-0 bg-opacity-40" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Admin Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            {/* Email */}
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-2 rounded text-sm hover:bg-black transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
