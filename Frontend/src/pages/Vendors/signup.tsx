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

export default function VendorSignup() {
  const [document, setDocument] = useState<File | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [vendorData, setVendorData] = useState<VendorSignupSchema | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

      const payload = {
        ...data,
        document: documentUrl,
      };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-white p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        
        {/* Left Side with Image */}
        <div
          className="md:w-1/2 h-64 md:h-auto relative bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/vendor.jpg")' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 py-10">
            <h1 className="text-4xl font-extrabold italic text-white mb-3">OffWeGo</h1>
            <p className="text-white text-sm max-w-xs">
              "We verify for quality. You deliver the best!"
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
            Vendor Signup
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto w-full">
            <input {...register("name")} placeholder="Name" className="input" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

            <input {...register("phone")} placeholder="Phone" className="input" />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}

            <input {...register("email")} placeholder="Email" className="input" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

            <input type="password" {...register("password")} placeholder="Password" className="input" />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="input"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
            )}

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => setDocument(e.target.files?.[0] || null)}
              className="input"
            />
            {!document && <p className="text-red-500 text-xs">Document is required</p>}

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-900 text-white font-semibold py-2 rounded text-sm hover:bg-blue-800 transition duration-200 shadow-md"
            >
              {isUploading ? "Uploading..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/vendor/login" className="text-blue-800 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {showOtpModal && vendorData && (
        <OtpVendorModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          vendorData={vendorData}
        />
      )}
      <ToastContainer />
    </div>
  );
}
