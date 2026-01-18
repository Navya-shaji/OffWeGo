import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { forgotPassword } from "@/services/vendor/VendorLoginService";

export default function VendorForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            toast.error("Please enter your email");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            await forgotPassword(trimmedEmail);
            setLoading(false);
            setSubmitted(true);
            toast.success("Password reset instructions sent to your email.");
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast.error(error.message || "Failed to process request. Please check if the email is correct.");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                backgroundImage: 'url("/images/vLogin.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "50% 60%",
            }}
        >
            {/* Logo */}
            <div className="absolute top-8 left-8 z-30">
                <Link to="/">
                    <img
                        src="/images/logo.png"
                        alt="OffWeGo"
                        className="h-12 w-auto drop-shadow-2xl"
                    />
                </Link>
            </div>

            <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200">
                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-serif font-semibold text-gray-800">
                                    Forgot Password?
                                </h2>
                                <p className="text-gray-600 mt-2 text-sm">
                                    Enter your registered email address and we'll send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="example@company.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-black transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Instructions"
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    to="/vendor/login"
                                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors inline-flex items-center gap-1"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Sign In
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-gray-600 text-sm mb-6">
                                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                            </p>
                            <Link
                                to="/vendor/login"
                                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500">
                            Don't have an account?{" "}
                            <Link to="/vendor/signup" className="text-purple-600 hover:underline font-medium">
                                Sign up as Partner
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
