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
      setIsUploading(false);     }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Signup</h2>

        <input {...register("name")} className="input mb-3" placeholder="Name" />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

        <input {...register("phone")} className="input mb-3" placeholder="Phone" />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}

        <input {...register("email")} className="input mb-3" placeholder="Email" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

        <input
          type="password"
          {...register("password")}
          className="input mb-3"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

        <input
          type="password"
          {...register("confirmPassword")}
          className="input mb-3"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
        )}

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setDocument(e.target.files?.[0] || null)}
          className="input mb-3"
        />
        {!document && <p className="text-red-500 text-xs mb-2">Document is required</p>}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          {isUploading ? "Uploading..." : "Sign Up"}
        </button>

        <ToastContainer />
      </form>

      {showOtpModal && vendorData && (
        <OtpVendorModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          vendorData={vendorData}
        />
      )}
    </div>
  );
}
