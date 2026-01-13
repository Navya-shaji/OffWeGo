import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/Types/User/auth/signupZodSchema";
import type { SignupFormData } from "@/Types/User/auth/signupZodSchema";
import { UserRegister } from "@/services/user/userService";
import OtpModal from "@/components/signup/OtpModal";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleSignup } from "@/components/signup/googleSignup";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setOtpData, closeOtpModal } from "@/store/slice/user/otpSlice";
import AuthLayout from "@/components/vendor/AuthLayout";




export default function Signup() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.otp);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });



  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const response = await UserRegister(data);
      if (response.data.success) {
        dispatch(
          setOtpData({
            message: response.data.message || "OTP sent to your email",
            userData: response.data.data || null,
          })
        );
        toast.success("Identity registration initialized. Verification in progress.");
      } else {
        toast.error(response.data.message || "Enrollment failed.");
      }
    } catch {
      toast.error("Transmission error. Please check your connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AuthLayout
        quote="The journey of a thousand miles begins with a single step. Join our community of global travelers."
        title="Register Account"
        subtitle="Initialize your profile coordinates"
        footerText="Already have an account?"
        footerLink="Sign In Portal"
        footerLinkTo="/login"
        backgroundImage="/images/world_landmarks.jpg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <input {...register("name")} placeholder="Full Name" className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <input {...register("phone")} placeholder="Phone" className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <input {...register("email")} placeholder="Email Address" className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="relative">
                <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="Password" className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-black">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <input type={showPassword ? "text" : "password"} {...register("confirmPassword")} placeholder="Confirm Password" className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-transparent border border-black text-black font-semibold py-3 rounded text-sm hover:bg-black hover:text-white transition duration-200 shadow-md mt-4 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Syncing..." : "Launch Profile"}
          </button>

          <div className="flex justify-center mt-4">
            <div className="scale-90"><GoogleSignup /></div>
          </div>
        </form>
      </AuthLayout>
      <OtpModal isOpen={isOpen} onClose={() => dispatch(closeOtpModal())} userData={watch()} />
      <ToastContainer />
    </>
  );
}
