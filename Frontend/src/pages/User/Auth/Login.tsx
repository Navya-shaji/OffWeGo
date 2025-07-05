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
import { GoogleSignup } from "@/components/signup/googleSignup";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      const userData = response.data.user;

      dispatch(
        login({
          user: {
            username: userData.name,
            email: userData.email,
          },
        })
      );

      localStorage.setItem(
        "authUser",
        JSON.stringify({
          isAuthenticated: true,
          user: {
            username: userData.name,
            email: userData.email,
            phone: userData.phone,
          },
        })
      );

      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        <div
          className="md:w-1/2 h-64 md:h-auto relative bg-cover bg-center"
          style={{ backgroundImage: "url('/images/login.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 py-10">
            <h1 className="text-4xl font-extrabold italic text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-white text-sm max-w-xs">
              Log in to continue your journey with OffWeGo
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
            Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <input
              {...register("email")}
              placeholder="Email"
              className="input"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="input pr-10"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-2 rounded text-sm hover:bg-blue-800 transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>
          <GoogleSignup />
          <p className="text-sm text-right text-blue-600 hover:underline cursor-pointer mt-2">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-800 font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
