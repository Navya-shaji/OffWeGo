import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VendorloginSchema,
  type VendorLoginFormData,
} from "@/Types/vendor/auth/TLogin";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { toast } from "react-hot-toast";
import { login } from "@/store/slice/vendor/authSlice";
import { vendorLogin } from "@/services/vendor/VendorLoginService";
import type { AxiosError } from "axios";
import type { Vendor } from "@/interface/vendorInterface";
import { setToken } from "@/store/slice/Token/tokenSlice";
import AuthLayout from "@/components/vendor/AuthLayout";

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
        toast.error("Your account has been blocked by admin.");
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

      // Redirect based on vendor status
      switch (response.status) {
        case "approved":
          navigate("/vendor/profile", { replace: true });
          break;
        case "pending":
          navigate("/vendor/status", { replace: true });
          break;
        case "rejected":
          navigate("/vendor/status", { replace: true });
          break;
        default:
          navigate("/vendor/status", { replace: true });
          break;
      }
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
    <AuthLayout
      quote="Vendor Access – Manage your services and grow your business!"
      title="Vendor Login"
      footerText="Don’t have an account?"
      footerLink="Sign up"
      footerLinkTo="/vendor/signup"
      showForgotPassword={true}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto w-full"
      >
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border rounded px-3 py-2 font-serif backdrop-blur-sm focus:bg-white transition-all focus:outline-none focus:border-black"
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
            className="w-full border rounded px-3 py-2 pr-10 font-serif backdrop-blur-sm focus:bg-white transition-all focus:outline-none focus:border-black"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-black"
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
          className="w-full bg-transparent border border-black text-black font-semibold py-2 rounded text-sm hover:bg-black hover:text-white transition duration-200 shadow-md uppercase tracking-wider"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  );
}
