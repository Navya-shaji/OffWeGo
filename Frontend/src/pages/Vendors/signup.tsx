import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { vendorRegister } from "@/services/vendor/vendorService";
import { toast } from "react-hot-toast";
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import { vendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import OtpVendorModal from "@/components/vendor/OtpModalVendor";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/vendor/AuthLayout";

export default function VendorSignup() {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [vendorData, setVendorData] = useState<VendorSignupSchema | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<VendorSignupSchema>({
        resolver: zodResolver(vendorSignupSchema),
        mode: "onChange",
    });

    const emailValue = watch("email");
    const isEmailValid = !!emailValue && !errors.email && !!dirtyFields.email;

    const watchedDocument = watch("document");

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("document", file, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: VendorSignupSchema) => {
        try {
            setIsUploading(true);
            console.log("Starting vendor registration with data:", data);

            // 1. Upload document to Cloudinary
            const documentUrl = await uploadToCloudinary(data.document);
            console.log("Document uploaded successfully:", documentUrl);

            // 2. Register vendor with document URL
            const payload = { ...data, document: documentUrl };
            const response = await vendorRegister(payload);

            if (response.data.success) {
                toast.success("Registration successful! Verify OTP to continue.");
                setVendorData(data);
                setShowOtpModal(true);
            } else {
                const errorMsg = response.data.message || "Registration failed. Please check your details.";
                toast.error(errorMsg);
                console.warn("Registration rejected by server:", errorMsg);
            }
        } catch (error: any) {
            console.error("Critical error during registration:", error);
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred. Please try again later.";
            toast.error(errorMessage);
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
                <form
                    onSubmit={handleSubmit(onSubmit, (errs) => {
                        console.log("Form Validation Errors:", errs);
                        toast.error("Please fix the errors in the form.");
                    })}
                    className="space-y-4"
                >
                    {/* ... (previous fields remain same, just ensure errors are handled) */}

                    {/* Business Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <input
                                {...register("name")}
                                placeholder="Business Name"
                                className={`w-full border rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name?.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter">{errors.name?.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <input
                                {...register("phone")}
                                placeholder="Phone (e.g. 9876543210)"
                                className={`w-full border rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.phone?.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter">{errors.phone?.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <input
                            {...register("email")}
                            placeholder="Email Address"
                            className={`w-full border rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:outline-none transition-all placeholder:text-gray-500 ${errors.email ? 'border-red-500 focus:border-red-500' :
                                isEmailValid ? 'border-green-500 focus:border-green-500' :
                                    'border-gray-300 focus:border-black'
                                }`}
                        />
                        {errors.email?.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter">{errors.email?.message}</p>}
                        {isEmailValid && <p className="text-green-600 text-[10px] uppercase font-bold tracking-widest mt-1">Email format is valid</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Password"
                                    className={`w-full border rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-black transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password?.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter">{errors.password?.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="Confirm Password"
                                className={`w-full border rounded px-3 py-2 font-serif bg-white/50 focus:bg-white focus:border-black focus:outline-none transition-all placeholder:text-gray-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.confirmPassword?.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter">{errors.confirmPassword?.message}</p>}
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleDocumentChange}
                                className={`w-full border border-dashed rounded px-3 py-8 text-center text-gray-500 text-sm file:hidden cursor-pointer hover:bg-white/60 transition-all bg-white/30 ${errors.document ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center space-y-1">
                                {watchedDocument ? (
                                    <>
                                        <span className="text-green-600 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">
                                            Document Selected
                                        </span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Click to change</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-gray-500 text-sm font-serif group-hover:text-black transition-colors">
                                            Upload Verification Document
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">JPG, PNG or PDF</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {errors.document?.message && <p className="text-red-500 text-[10px] uppercase font-bold tracking-tighter mt-1">{String(errors.document.message)}</p>}
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
