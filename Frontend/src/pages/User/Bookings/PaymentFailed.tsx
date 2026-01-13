import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, RefreshCw, Home, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/home/navbar/Header";

export default function PaymentFailed() {
    const navigate = useNavigate();
    const location = useLocation();
    const errorMessage = location.state?.error || "Your transaction could not be completed at this time.";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-24 pb-12 px-4 selection:bg-rose-100 font-sans">
            <Header forceSolid />

            <div className="max-w-md mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                >
                    {/* Header Section */}
                    <div className="bg-rose-500 p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_2px,transparent_1px)] bg-[size:24px_24px]"></div>
                        </div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <XCircle className="w-12 h-12 text-rose-500" />
                        </motion.div>

                        <h1 className="text-3xl font-black text-white mb-2">Payment Failed</h1>
                        <p className="text-rose-100 font-medium">Something went wrong with your transaction.</p>
                    </div>

                    {/* Body Section */}
                    <div className="p-10 space-y-8">
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-slate-600 font-bold uppercase tracking-widest bg-slate-50 py-2 rounded-lg">Reason for Failure</p>
                            <p className="text-rose-600 font-black text-lg leading-tight px-4">{errorMessage}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-rose-900 uppercase tracking-widest">Common Troubleshooting</p>
                                    <ul className="text-xs text-rose-700/80 font-medium list-disc list-inside space-y-1">
                                        <li>Insufficient funds or limit exceeded</li>
                                        <li>Incorrect card details entered</li>
                                        <li>Bank declined the single use token</li>
                                        <li>Network timeout during validation</li>
                                    </ul>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 text-center font-medium px-4">
                                Don't worry, your booking hasn't been cancelled yet. You can try payment again from your bookings page.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate("/bookings")}
                                className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> Retry Payment
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" /> Return Home
                            </button>
                        </div>
                    </div>

                    {/* Footer Decoration */}
                    <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">OffWeGo Payment Safeguard</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
