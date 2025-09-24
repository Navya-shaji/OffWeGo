import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/Types/User/auth/loginZodSchema";
import type { LoginFormData } from "@/Types/User/auth/loginZodSchema";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { login } from "@/store/slice/user/authSlice";
import { userLogin } from "@/services/user/userService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { GoogleSignup } from "@/components/signup/googleSignup";
import { setToken } from "@/store/slice/Token/tokenSlice"; 

export default function UserLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const notify = () => toast("Login successful");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await userLogin(data);

      // Save user in auth slice
      dispatch(
        login({
          user: response.user,
        })
      );

      // Save token in token slice
      dispatch(setToken(response.accessToken));

      notify();
      navigate("/", { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const backendMessage = axiosError.response?.data?.message;
      const message =
        backendMessage ||
        axiosError.message ||
        "Login failed. Please try again.";

      if (message.toLowerCase().includes("blocked")) {
        toast.error("Your account is blocked by the admin");
      } else {
        toast.error(` ${message}`);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/loginBG2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[60vh] shadow-2xl rounded-2xl overflow-hidden">
        <div className="md:w-1/2 h-64 md:h-full relative bg-cover bg-center">
          <div className="absolute inset-0 bg-opacity-40" />
        </div>

        <div className="w-full md:w-1/2 px-8 py-12 flex flex-col justify-center bg-white/70 shadow-lg rounded-lg backdrop-blur-sm">
          <h2 className="text-3xl font-quicksand text-center text-gray-900 mb-6 tracking-wide">
            User Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 max-w-sm mx-auto w-full"
          >
            {/* Email */}
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md px-4 py-4 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150"
              />
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-4 py-4 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150"
              />
              <span
                className="absolute right-3 top-4 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-amber-900 text-white font-medium py-2.5 rounded-md text-sm hover:bg-amber-900 active:bg-yellow-950 transition duration-200 shadow-lg"
            >
              Login
            </button>
          </form>

          {/* Signup */}
          <p className="text-sm text-center text-gray-600 mt-5">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-700 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* Google Login */}
          <div className="mt-4 flex justify-center">
            <GoogleSignup />
          </div>

          {/* Forgot Password */}
          <p className="text-sm text-center mt-3">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800 hover:underline transition"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
