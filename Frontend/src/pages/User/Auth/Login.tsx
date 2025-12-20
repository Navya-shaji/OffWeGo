import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/Types/User/auth/loginZodSchema";
import type { LoginFormData } from "@/Types/User/auth/loginZodSchema";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { login } from "@/store/slice/user/authSlice";
import { userLogin } from "@/services/user/userService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { GoogleSignup } from "@/components/signup/googleSignup";
import { setToken } from "@/store/slice/Token/tokenSlice";
import ForgotPasswordModal from "@/components/ForgotPassword/forgot-password";

export default function UserLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await userLogin(data.email,data.password);
      dispatch(
        login({
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );
      dispatch(setToken(response.accessToken));
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const backendMessage =
        axiosError.response?.data?.message || axiosError.response?.data?.error;
      toast.error(backendMessage || "❌ Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md px-4 py-4 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md px-4 py-4 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span
                  className="absolute right-3 top-4 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                  onClick={() => !isLoading && setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-900 text-white font-medium py-2.5 rounded-md text-sm hover:bg-amber-800 active:bg-yellow-950 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-5">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-700 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>

            <div className="mt-4 flex justify-center">
              <GoogleSignup />
            </div>

            <p className="text-sm text-center mt-3">
              <button
                onClick={() => setShowForgotModal(true)} // ✅ open modal
                className="text-blue-600 hover:text-blue-800 hover:underline transition"
              >
                Forgot Password?
              </button>
            </p>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
}
