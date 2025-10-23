import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VendorloginSchema,
  type VendorLoginFormData,
} from "@/Types/vendor/auth/TLogin";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { toast } from "react-toastify";
import { login } from "@/store/slice/vendor/authSlice";
import { vendorLogin } from "@/services/vendor/VendorLoginService";
import type { AxiosError } from "axios";
import type { Vendor } from "@/interface/vendorInterface";
import { setToken } from "@/store/slice/Token/tokenSlice";

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
      const response = await vendorLogin(data.email, data.password);
      const rawVendor = response.vendor;

      if (!rawVendor) {
        toast.error("Vendor not found");
        return;
      }

      if (rawVendor.isBlocked) {
        toast.error("Your account has been blocked by the admin.");
        return;
      }

      const vendorData: Vendor = rawVendor;

      dispatch(
        login({
          vendor: vendorData,
          token: response.accessToken,
          refreshToken: "",
        })
      );

      if (response.accessToken) {
        dispatch(setToken(response.accessToken));
      }

      toast.success("Login successful");
      navigate("/vendor/profile", { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Login failed";
      toast.error(message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/vLogin.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "50% 60%",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[85vh] shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="md:w-1/2 h-64 md:h-full relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-5xl font-extrabold italic text-white mb-6 drop-shadow-lg">
                OffWeGo
              </h1>
              <p className="text-white text-lg drop-shadow-md max-w-md">
                "Vendor Access – Manage your services and grow your business!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-amber-50/40 backdrop-blur-sm">
          <h2 className="text-3xl font-serif text-center text-black mb-6">
            Vendor Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full border rounded px-3 py-2 font-serif backdrop-blur-sm focus:bg-white transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full border rounded px-3 py-2 pr-10 font-serif backdrop-blur-sm focus:bg-white transition-all"
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

            <button
              type="submit"
              className="w-full bg-transparent border border-black text-black font-semibold py-2 rounded text-sm hover:bg-black hover:text-white transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-4 font-serif tracking-wide">
            Don’t have an account?{" "}
            <Link
              to="/vendor/signup"
              className="text-black font-semibold hover:underline transition-colors"
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
