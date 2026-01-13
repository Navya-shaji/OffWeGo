import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/Types/User/auth/loginZodSchema";
import type { LoginFormData } from "@/Types/User/auth/loginZodSchema";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { login } from "@/store/slice/user/authSlice";
import { userLogin } from "@/services/user/userService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { GoogleSignup } from "@/components/signup/googleSignup";
import { setToken } from "@/store/slice/Token/tokenSlice";
import ForgotPasswordModal from "@/components/ForgotPassword/forgot-password";
import AuthLayout from "@/components/vendor/AuthLayout";



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
      const response = await userLogin(data.email, data.password);
      dispatch(
        login({
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );
      dispatch(setToken(response.accessToken));
      toast.success("Welcome back! Login successful.");
      navigate("/", { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const backendMessage =
        axiosError.response?.data?.message || axiosError.response?.data?.error;
      toast.error(backendMessage || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        quote="Access your global coordinates. The world is waiting for your next adventure."
        title="Log In"
        footerText="Don’t have an account?"
        footerLink="Register Account"
        footerLinkTo="/signup"
        showForgotPassword={true}
        onForgotPasswordClick={() => setShowForgotModal(true)}
        backgroundImage="/images/girltravel.jpg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto w-full">
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
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
            className="w-full bg-transparent border border-black text-black font-semibold py-2 rounded text-sm hover:bg-black hover:text-white transition duration-200 shadow-md uppercase tracking-wider disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-center mt-4">
            <div className="scale-90"><GoogleSignup /></div>
          </div>
        </form>
      </AuthLayout>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
}
