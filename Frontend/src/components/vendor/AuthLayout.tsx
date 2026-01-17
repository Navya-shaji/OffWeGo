import React from "react";
import { Link } from "react-router-dom";

export interface AuthLayoutProps {
    children: React.ReactNode;
    quote: string;
    title: string;
    subtitle?: string;
    footerText: string;
    footerLink: string;
    footerLinkTo: string;
    showForgotPassword?: boolean;
    onForgotPasswordClick?: () => void;
    backgroundImage?: string;
}

export default function AuthLayout({
    children,
    quote,
    title,
    subtitle,
    footerText,
    footerLink,
    footerLinkTo,
    showForgotPassword = false,
    onForgotPasswordClick,
    backgroundImage = "/images/vLogin.jpg",
}: AuthLayoutProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                backgroundImage: `url("${backgroundImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "50% 60%",
            }}
        >
            {/* Logo in top-left corner of entire page */}
            <div className="absolute top-8 left-8 z-30">
                <Link to="/vendor/login">
                    <img
                        src="/images/logo.png"
                        alt="OffWeGo"
                        className="h-12 w-auto drop-shadow-2xl"
                    />
                </Link>
            </div>

            <div className="flex flex-col md:flex-row w-full max-w-6xl h-[85vh] shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                {/* Left Side - Image/Quote */}
                <div className="md:w-5/12 h-64 md:h-full relative hidden md:block">
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-[2px]">
                        <div className="relative z-10 max-w-sm">
                            <p className="text-white text-xl md:text-2xl font-serif italic drop-shadow-xl leading-relaxed">
                                "{quote}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-amber-50/60 backdrop-blur-md flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">

                        <div className="mb-8">
                            <h2 className="text-3xl font-serif text-black mb-2">{title}</h2>
                            {subtitle && <p className="text-gray-600 font-serif text-sm">{subtitle}</p>}
                        </div>

                        {children}

                        <div className="mt-8 text-center space-y-3">
                            <p className="text-sm text-gray-700 font-serif">
                                {footerText}{" "}
                                <Link
                                    to={footerLinkTo}
                                    className="text-black font-semibold hover:underline transition-colors block md:inline mt-1 md:mt-0"
                                >
                                    {footerLink}
                                </Link>
                            </p>

                            {showForgotPassword && (
                                <p className="text-sm text-center text-gray-600 hover:text-black transition-colors font-serif">
                                    {onForgotPasswordClick ? (
                                        <button
                                            type="button"
                                            onClick={onForgotPasswordClick}
                                            className="hover:underline"
                                        >
                                            Forgot Password?
                                        </button>
                                    ) : (
                                        <Link to="/vendor/forgot-password">Forgot Password?</Link>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
