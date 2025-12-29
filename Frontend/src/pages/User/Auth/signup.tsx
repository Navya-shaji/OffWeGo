import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/Types/User/auth/signupZodSchema";
import type { SignupFormData } from "@/Types/User/auth/signupZodSchema";
import { UserRegister } from "@/services/user/userService";
import OtpModal from "@/components/signup/OtpModal";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleSignup } from "@/components/signup/googleSignup";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setOtpData, closeOtpModal } from "@/store/slice/user/otpSlice";

export default function Signup() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.otp);
  const [showPassword, setShowPassword] = useState(false);

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
        dispatch(
          setOtpData({
            message: response.data.message || "OTP sent to your email",
            userData: response.data.data || null,
          })
        );
        toast.success(
          "Registration successful! Please check your email for the OTP.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } else {
        toast.error(response.data.message || "Failed to send OTP.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during registration. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-2 sm:p-3 md:p-6 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/girltravel.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "50% 60%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[95vh] sm:h-[90vh] md:h-[85vh] lg:h-[80vh] shadow-2xl rounded-lg md:rounded-2xl overflow-hidden md:border border-gray-200 relative">
        {/* Image section - full height on mobile, half on desktop */}
        <div 
          className="absolute inset-0 md:relative md:w-1/2 md:h-full"
          style={{
            backgroundImage: 'url("/images/girltravel.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "50% 60%",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark overlay for mobile to make text readable */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/10" />
        </div>

        {/* Form section - positioned over image on mobile, side-by-side on desktop */}
        <div className="w-full md:w-1/2 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-center bg-transparent md:bg-amber-50/60 relative z-10 overflow-hidden">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Link to="/" className="select-none">
              <img src="/images/logo.png" alt="OffWeGo" className="h-12 sm:h-14 w-auto" />
            </Link>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-center text-white md:text-black mb-2 sm:mb-3 md:mb-4 drop-shadow-lg">
            Create Your Account
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-4 md:space-y-3 max-w-sm mx-auto w-full"
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 md:text-gray-400 w-5 h-5" />
              <input
                {...register("name")}
                placeholder="Enter Your name"
                className="w-full border border-white/30 md:border-gray-300 rounded-lg pl-11 pr-3 py-3.5 sm:py-3.5 md:px-4 md:py-2.5 text-sm sm:text-base md:text-base font-serif bg-white/60 backdrop-blur-md md:bg-white focus:border-white md:focus:border-black focus:ring-2 focus:ring-white/30 md:focus:ring-black/20 focus:outline-none transition duration-150 placeholder:text-gray-600 md:placeholder:text-gray-400"
              />
              {errors.name ? (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.name.message}
                </p>
              ) : (
                <div className="h-[12px] sm:h-[14px] md:h-[16px]" />
              )}
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 md:text-gray-400 w-5 h-5" />
              <input
                {...register("phone")}
                placeholder="Enter your phone"
                type="tel"
                className="w-full border border-white/30 md:border-gray-300 rounded-lg pl-11 pr-3 py-3.5 sm:py-3.5 md:px-4 md:py-2.5 text-sm sm:text-base md:text-base font-serif bg-white/60 backdrop-blur-md md:bg-white focus:border-white md:focus:border-black focus:ring-2 focus:ring-white/30 md:focus:ring-black/20 focus:outline-none transition duration-150 placeholder:text-gray-600 md:placeholder:text-gray-400"
              />
              {errors.phone ? (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.phone.message}
                </p>
              ) : (
                <div className="h-[12px] sm:h-[14px] md:h-[16px]" />
              )}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 md:text-gray-400 w-5 h-5" />
              <input
                {...register("email")}
                placeholder="Enter your email"
                type="email"
                className="w-full border border-white/30 md:border-gray-300 rounded-lg pl-11 pr-3 py-3.5 sm:py-3.5 md:px-4 md:py-2.5 text-sm sm:text-base md:text-base font-serif bg-white/60 backdrop-blur-md md:bg-white focus:border-white md:focus:border-black focus:ring-2 focus:ring-white/30 md:focus:ring-black/20 focus:outline-none transition duration-150 placeholder:text-gray-600 md:placeholder:text-gray-400"
              />
              {errors.email ? (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.email.message}
                </p>
              ) : (
                <div className="h-[12px] sm:h-[14px] md:h-[16px]" />
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 md:text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="w-full border border-white/30 md:border-gray-300 rounded-lg pl-11 pr-11 sm:pr-12 md:pr-12 py-3.5 sm:py-3.5 md:px-4 md:py-2.5 text-sm sm:text-base md:text-base font-serif bg-white/60 backdrop-blur-md md:bg-white focus:border-white md:focus:border-black focus:ring-2 focus:ring-white/30 md:focus:ring-black/20 focus:outline-none transition duration-150 placeholder:text-gray-600 md:placeholder:text-gray-400"
              />
              <span
                className="absolute right-3 sm:right-4 md:right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 md:text-gray-500 hover:text-gray-800 md:hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password ? (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.password.message}
                </p>
              ) : (
                <div className="h-[12px] sm:h-[14px] md:h-[16px]" />
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 md:text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                className="w-full border border-white/30 md:border-gray-300 rounded-lg pl-11 pr-11 sm:pr-12 md:pr-12 py-3.5 sm:py-3.5 md:px-4 md:py-2.5 text-sm sm:text-base md:text-base font-serif bg-white/60 backdrop-blur-md md:bg-white focus:border-white md:focus:border-black focus:ring-2 focus:ring-white/30 md:focus:ring-black/20 focus:outline-none transition duration-150 placeholder:text-gray-600 md:placeholder:text-gray-400"
              />
              <span
                className="absolute right-3 sm:right-4 md:right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 md:text-gray-500 hover:text-gray-800 md:hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.confirmPassword ? (
                <p className="text-red-500 text-[10px] sm:text-xs mt-0.5">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                <div className="h-[12px] sm:h-[14px] md:h-[16px]" />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white/20 backdrop-blur-sm md:bg-transparent border-2 border-white md:border-black text-white md:text-black font-semibold py-3.5 sm:py-3.5 md:py-2.5 rounded-lg text-sm sm:text-base md:text-base hover:bg-white/30 md:hover:bg-black hover:text-black md:hover:text-white transition duration-200 shadow-lg active:scale-[0.98]"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-2 sm:mt-3 md:mt-4 flex justify-center">
            <GoogleSignup />
          </div>

          <p className="text-[10px] sm:text-xs md:text-sm text-center text-white md:text-gray-700 mt-1.5 sm:mt-2 md:mt-3 font-serif tracking-wide px-2 drop-shadow-lg">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white md:text-black font-semibold hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>

          <p className="text-[10px] sm:text-xs md:text-sm text-center text-white md:text-gray-700 mt-1 sm:mt-1.5 md:mt-2 font-serif tracking-wide px-2 drop-shadow-lg">
            Are you a vendor?{" "}
            <Link
              to="/vendor/login"
              className="text-white md:text-black font-semibold hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>

          <OtpModal
            isOpen={isOpen}
            onClose={() => dispatch(closeOtpModal())}
            userData={watch()}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
