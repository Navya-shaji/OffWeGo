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
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/vendor/AuthLayout";

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
        <>
            <AuthLayout
                quote="Join our premium network of verified vendors. Connect with thousands of travelers looking for their next diverse adventure."
                title="Partner Signup"
                subtitle="Create your account to start listing packages"
                footerText="Already a partner?"
                footerLink="Login here"
                footerLinkTo="/vendor/login"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <input
                                {...register("name")}
                                placeholder="Business Name"
                                className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500"
                            />
                            {errors.name?.message && <p className="text-red-500 text-xs">{errors.name?.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <input
                                {...register("phone")}
                                placeholder="Phone"
                                className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500"
                            />
                            {errors.phone?.message && <p className="text-red-500 text-xs">{errors.phone?.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <input
                            {...register("email")}
                            placeholder="Email Address"
                            className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500"
                        />
                        {errors.email?.message && <p className="text-red-500 text-xs">{errors.email?.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-black">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password?.message && <p className="text-red-500 text-xs">{errors.password?.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="Confirm Password"
                                className="w-full border border-gray-300 rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500"
                            />
                            {errors.confirmPassword?.message && <p className="text-red-500 text-xs">{errors.confirmPassword?.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => setDocument(e.target.files?.[0] || null)}
                                className="w-full border border-gray-300 border-dashed rounded px-3 py-6 text-center text-gray-500 text-sm file:hidden cursor-pointer hover:bg-white/60 transition-colors bg-white/30"
                            />
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                {document ? (
                                    <span className="text-black text-sm font-medium truncate px-4">{document?.name}</span>
                                ) : (
                                    <span className="text-gray-500 text-sm font-serif">Upload Verification Document</span>
                                )}
                            </div>
                        </div>
                        {!document && <p className="text-red-500 text-xs mt-1">Required</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full bg-transparent border border-black text-black font-semibold py-3 rounded text-sm hover:bg-black hover:text-white transition duration-200 shadow-md mt-4 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? "Creating Account..." : "Register"}
                    </button>
                </form>
            </AuthLayout>

            <ToastContainer position="bottom-right" theme="dark" />
            {showOtpModal && vendorData && (
                <OtpVendorModal
                    isOpen={showOtpModal}
                    onClose={() => setShowOtpModal(false)}
                    vendorData={vendorData}
                />
            )}
        </>
    );
}
