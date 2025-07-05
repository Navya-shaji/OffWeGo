import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/Types/User/auth/signupZodSchema";
import type { SignupFormData } from "@/Types/User/auth/signupZodSchema";
import { UserRegister } from "@/services/user/userService";
import OtpModal from "@/components/signup/OtpModal";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleSignup } from "@/components/signup/googleSignup";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [otpData, setOtpData] = useState(null);
  console.log(modalMessage, otpData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await UserRegister(data);
      if (response.data.success) {
        setModalMessage(
          response.data.message || "OTP sent to your email address"
        );
        setOtpData(response.data.data || null);
        setIsOpen(true);
        toast.success(
          "Registration successful! Please check your email for the OTP.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        toast.error(
          response.data.message || "Failed to send OTP. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during registration. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-100 via-sky-100 to-white p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        
       <div
  className="md:w-1/2 h-64 md:h-auto relative bg-cover bg-center"
  style={{ backgroundImage: 'url("/images/signup.jpg")' }}
>
  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 py-10">
    <h1 className="text-4xl font-extrabold italic text-white mb-3">OffWeGo</h1>
    <p className="text-white text-sm max-w-xs">
      "Travel is the only investment that makes you richer with memories, not possessions."
    </p>
  </div>
</div>


  
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
            Get Started Now
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <input {...register("name")} placeholder="Name" className="input" />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}

            <input
              {...register("phone")}
              placeholder="Phone"
              className="input"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}

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

            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className="input"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-2 rounded text-sm hover:bg-blue-800 transition duration-200 shadow-md"
            >
              Signup
            </button>
          </form>
          <GoogleSignup />
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-800 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>

          <OtpModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            userData={watch()}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
