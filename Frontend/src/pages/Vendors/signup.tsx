import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { vendorRegister } from "@/services/vendor/vendorService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import { vendorSignupSchema } from "@/Types/vendor/auth/Tsignup"; 
export default function VendorSignup() {
  const [document, setDocument] = useState<File | null>(null);

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

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("document", document);

    try {
      const response = await vendorRegister(formData);
      if (response.data.success) {
        toast.success("Vendor registered! Please verify OTP from email.");
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      const err=error as Error
      toast.error(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Vendor Signup</h2>

        {/* Name */}
        <div className="mb-3">
          <input
            type="text"
            {...register("name")}
            placeholder="Name"
            className="input"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <input
            type="text"
            {...register("phone")}
            placeholder="Phone"
            className="input"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div className="mb-3">
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="mb-3">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="input"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="input"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Document Upload */}
        <div className="mb-3">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setDocument(e.target.files?.[0] || null)}
            className="input"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          Sign Up
        </button>

        <ToastContainer />
      </form>
    </div>
  );
}
