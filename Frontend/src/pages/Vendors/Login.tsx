import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorloginSchema } from "@/Types/vendor/auth/TLogin"; 
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { vendorLogin } from "@/services/vendor/VendorLoginService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { Login } from "@/store/slice/vendor/authSlice";
import type { VendorLoginFormData } from "@/Types/vendor/auth/TLogin";

export default function VendorLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorLoginFormData>({
    resolver: zodResolver(VendorloginSchema),
  });

  const onSubmit = async (data: VendorLoginFormData) => {
    try {
      // Pass whole data object directly
      const response = await vendorLogin(data.email, data.password);
      const vendorData = response.vendor 
        const token = response.token;

      if (!vendorData) {
        toast.error("Invalid response from server");
        return;
      }

      if (vendorData.isBlocked) {
        toast.error("Your account has been blocked by the admin.");
        return;
      }

      dispatch(
      Login({
        vendor: vendorData,
        token: token,
      })
    );

      navigate("/vendor/profile");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendMessage = axiosError.response?.data?.message;
      const message =
        backendMessage || axiosError.message || "Login failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left panel */}
        <div className="bg-black text-white md:w-1/2 flex flex-col justify-center items-center p-8 space-y-2 text-center">
          <h1 className="text-4xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Vendor
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Manage your dashboard and stay updated
          </p>
        </div>

        {/* Right panel - login form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
            Vendor Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 text-white font-semibold py-2 rounded-md hover:bg-blue-900 transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/vendor/signup"
              className="text-blue-800 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-sm text-center text-blue-600 hover:underline mt-2">
            <Link to="/vendor/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
