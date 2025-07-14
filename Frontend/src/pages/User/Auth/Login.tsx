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
// import { useEffect } from "react";
// import { useAppSelector } from "@/hooks";

export default function UserLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/home", { replace: true });
  //   }
  // }, [isAuthenticated]);
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
      const userData = response.user;

      if (!userData) throw new Error("User data missing from response");

      dispatch(
        login({
          user: {
            username: userData.username,
            email: userData.email,
          },
        })
      );

      navigate("/",{ replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[85vh] shadow-2xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        {/* Left image/panel */}
        <div
          className="md:w-1/2 h-64 md:h-full relative bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/userLogin.jpeg")' }}
        >
          <div className="absolute inset-0  bg-opacity-40" />
        </div>

        {/* Right login form panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-serif text-center text-black mb-6">
            {" "}
            User Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            {/* Email input */}
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            {/* Password input */}
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
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-800 text-white font-semibold py-2 rounded text-sm hover:bg-blue-900 transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-800 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-sm text-center text-blue-600 hover:underline mt-2">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
