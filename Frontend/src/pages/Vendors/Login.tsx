import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorloginSchema, type VendorLoginFormData } from "@/Types/vendor/auth/TLogin";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { toast } from "react-toastify";
import { login } from "@/store/slice/vendor/authSlice"; 
import { vendorLogin } from "@/services/vendor/VendorLoginService";
import type { AxiosError } from "axios";
import type { Vendor } from "@/interface/vendorInterface";

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
      console.log("Raw",rawVendor)

      if (!rawVendor) {
        toast.error("Vendor not found");
        return;
      }

      if (rawVendor.isBlocked) {
        toast.error("Your account has been blocked by the admin.");
        return;
      }

      const vendorData: Vendor = rawVendor;

      dispatch(login({ vendor: vendorData, token: response.accessToken }));
      toast.success("Login successful");
      navigate("/vendor/profile", { replace: true });

    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || axiosError.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-[85vh] shadow-2xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        
        {/* Left Image Section */}
        <div
          className="bg-black text-white md:w-1/2 flex flex-col justify-center items-center p-8 space-y-2 text-center bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/vendorLogin.jpeg")',
          }}
        >
          <h1 className="text-4xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            OffWeGo
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            Vendor Access – Manage your services and grow your business!
          </p>
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

            <button
              type="submit"
              className="w-full bg-blue-800 text-white font-semibold py-2 rounded text-sm hover:bg-blue-900 transition duration-200 shadow-md"
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
