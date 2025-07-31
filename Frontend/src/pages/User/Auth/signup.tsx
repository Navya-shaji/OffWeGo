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
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setOtpData, closeOtpModal } from "@/store/slice/user/otpSlice";
export default function Signup() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.otp);
  const [showPassword, setShowPassword] = useState(false);

  const {register,handleSubmit,formState: { errors },watch,} = useForm<SignupFormData>({
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
        toast.success("Registration successful! Please check your email for the OTP.",
          {
            position: "top-right",autoClose: 3000,
          }
        );
      } else {
        toast.error(response.data.message || "Failed to send OTP.", {
          position: "top-right", autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during registration. Please try again.", {
        position: "top-right",autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[85vh] shadow-2xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        <div className="md:w-1/2 h-64 md:h-full relative bg-cover bg-center"style={{ backgroundImage: 'url("/images/signup.jpg")' }} >
          <div className="absolute inset-0 bg-opacity-40" />
        </div>
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-serif text-center text-black mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto w-full">
            <div>
              <input {...register("name")} placeholder="Name" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {errors.name ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <input {...register("phone")} placeholder="Phone" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              {errors.phone ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <input {...register("email")} placeholder="Email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div className="relative">
              <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="Password" className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
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

            <div>
              <input type={showPassword ? "text" : "password"}  {...register("confirmPassword")} placeholder="Confirm Password"  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              {errors.confirmPassword ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <button type="submit" className="w-full bg-blue-800 text-white font-semibold py-2 rounded text-sm hover:bg-blue-900 transition duration-200 shadow-md">
              Signup
            </button>
          </form>

          <GoogleSignup />

          <p className="text-sm text-center text-gray-600 mt-4"> Already have an account?{" "}
            <Link to="/login" className="text-blue-800 font-semibold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-sm text-center text-gray-600 mt-4"> Are You a vendor?
            <Link to="/vendor/login" className="text-blue-800 font-semibold hover:underline" >
              Log in
            </Link>
          </p>
          
          <OtpModal isOpen={isOpen} onClose={() => dispatch(closeOtpModal())} userData={watch()} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
