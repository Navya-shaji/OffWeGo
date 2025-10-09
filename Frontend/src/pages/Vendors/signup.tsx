import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { vendorRegister } from "@/services/vendor/vendorService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import { vendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import OtpVendorModal from "@/components/vendor/OtpModalVendor";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function VendorSignup() {
  const [document, setDocument] = useState<File | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [vendorData, setVendorData] = useState<VendorSignupSchema | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorSignupSchema>({
    resolver: zodResolver(vendorSignupSchema),
  });

  const onSubmit = async (data: VendorSignupSchema) => {
    if (!document) {
      toast.error("Please upload your document");
      return;
    }

    try {
      setIsUploading(true);
      const documentUrl = await uploadToCloudinary(document);

      const payload = { ...data, document: documentUrl };
      const response = await vendorRegister(payload);

      if (response.data.success) {
        toast.success("Vendor registered! Please verify OTP.");
        setVendorData(data);
        setShowOtpModal(true);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong during signup.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/signup.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "50% 60%",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[85vh] shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Left Side - Transparent */}
        <div className="md:w-1/2 h-64 md:h-full relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-5xl font-extrabold italic text-white mb-6 drop-shadow-lg">
                OffWeGo
              </h1>
              <p className="text-white text-lg drop-shadow-md max-w-md">
                "We verify for quality. You deliver the best!"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form with transparent background */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-amber-50/40 backdrop-blur-sm">
          <h2 className="text-3xl font-serif text-center text-black mb-6">
            Become a Verified Vendor
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <div>
              <input
                {...register("name")}
                placeholder="Name"
                className="w-full border rounded px-3 py-2 font-serif backdrop-blur-sm focus:bg-white transition-all"
              />
              {errors.name ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <input
                {...register("phone")}
                placeholder="Phone"
                className="w-full border rounded px-3 py-2 font-serif backdrop-blur-sm focus:bg-white transition-all"
              />
              {errors.phone ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full border rounded px-3 py-2 font-serif backdrop-blur-sm focus:bg-white transition-all"
              />
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  className="w-full border rounded px-3 py-2 pr-10 font-serif  backdrop-blur-sm focus:bg-white transition-all"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                  className="w-full border rounded px-3 py-2 pr-10 font-serif backdrop-blur-sm focus:bg-white transition-all"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.confirmPassword ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setDocument(e.target.files?.[0] || null)}
                className="w-full border rounded px-3 py-2 font-serif backdrop-blur-sm focus:bg-white transition-all file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:text-black"
              />
              {!document ? (
                <p className="text-red-500 text-xs mt-1">
                  Document is required
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-transparent border border-black text-black font-semibold py-2 rounded text-sm hover:bg-black hover:text-white transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-4 font-serif tracking-wide">
            Already have an account?{" "}
            <Link
              to="/vendor/login"
              className="text-black font-semibold hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>

          <p className="text-sm text-center text-gray-700 mt-4 font-serif tracking-wide">
            Are you a user?{" "}
            <Link
              to="/signup"
              className="text-black font-semibold hover:underline transition-colors"
            >
              User Signup
            </Link>
          </p>

          {showOtpModal && vendorData && (
            <OtpVendorModal
              isOpen={showOtpModal}
              onClose={() => setShowOtpModal(false)}
              vendorData={vendorData}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}