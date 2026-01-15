import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
    Star,
    X,
    MapPin,
    Users,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    AlertCircle,
    MessageCircle,
    RefreshCw,
    Ticket,
    Download,
    Sparkles,
    ShieldCheck,
} from "lucide-react";
import Header from "@/components/home/navbar/Header";
import { cancelBooking, rescheduleBooking } from "@/services/Booking/bookingService";
import { findOrCreateChat } from "@/services/chat/chatService";
import { CancelBookingModal } from "@/components/Modular/CancelBookingModal";
import { ReviewModal } from "@/components/Modular/ReviewModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { resolveCloudinaryUrl } from "@/utilities/cloudinaryUpload";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { motion } from "framer-motion";

import type { Booking, Traveler } from "@/interface/Boooking";

interface ExtendedBooking extends Booking {
    _id: string; // Required for this page
    bookingStatus?: string;
    paymentMethod?: string;
    payment_method?: string;
    paymentProvider?: string;
    payment_provider?: string;
    gateway?: string;
    paymentGateway?: string;
    usedWallet?: boolean;
    walletTransactionId?: string;
    walletTxnId?: string;
    stripePaymentIntentId?: string;
    stripeSessionId?: string;
    payment_id?: string;
    paymentId?: string;
    razorpayPaymentId?: string;
    selectedPackage: Booking["selectedPackage"] & {
        duration?: number;
        imageUrls?: string[];
        packageName?: string;
        destination?: string;
        ownerId?: string;
    };
}

const RescheduleModal = ({
    open,
    onClose,
    bookingId,
    currentDate,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    bookingId: string;
    currentDate?: string;
    onSuccess?: () => void;
}) => {
    const [newDate, setNewDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async () => {
        setError("");

        if (!newDate) {
            setError("Please select a new date");
            return;
        }

        const selectedDate = new Date(newDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            setError("New date must be in the future");
            return;
        }

        if (currentDate) {
            const current = new Date(currentDate);
            current.setHours(0, 0, 0, 0);
            if (selectedDate <= current) {
                setError("New date must be after the current booking date");
                return;
            }
        }

        try {
            setLoading(true);
            await rescheduleBooking(bookingId, newDate);
            toast.success("Booking rescheduled successfully! 🎉");
            setNewDate("");
            onSuccess?.();
            onClose();
        } catch (error: unknown) {
            console.error("Reschedule error:", error);
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error)?.message || "Failed to reschedule. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewDate("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Reschedule Booking</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Select New Date
                        </label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            New date must be after {currentDate ? new Date(currentDate).toLocaleDateString() : "today"}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" onClick={handleClose} disabled={loading} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !newDate}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Rescheduling..." : "Confirm Reschedule"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const BookingDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const booking = location.state?.booking as ExtendedBooking;

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);
    const [reviewPackage, setReviewPackage] = useState<{
        packageId: string;
        packageName: string;
        destination: string;
    } | null>(null);

    if (!booking) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Booking not found</p>
                    <Button onClick={() => navigate("/bookings")}>Back to Bookings</Button>
                </div>
            </div>
        );
    }

    const getBookingStatus = (booking: ExtendedBooking) => {
        if (booking.bookingStatus?.toLowerCase() === "cancelled") return "cancelled";

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(booking.selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const duration = booking.selectedPackage.duration || 1;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration - 1);
        endDate.setHours(23, 59, 59, 999);

        if (endDate < today) return "completed";
        if (startDate > today) return "upcoming";
        return "ongoing";
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; border: string; text: string; label: string }> = {
            upcoming: { bg: "bg-blue-50/50", border: 'border-blue-100', text: "text-blue-600", label: "Upcoming" },
            ongoing: { bg: "bg-green-50/50", border: 'border-green-100', text: "text-green-600", label: "Ongoing" },
            completed: { bg: "bg-gray-50/50", border: 'border-gray-100', text: "text-gray-600", label: "Completed" },
            cancelled: { bg: "bg-red-50/50", border: 'border-red-100', text: "text-red-500", label: "Cancelled" },
        };
        const c = config[status] || config.upcoming;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full border ${c.bg} ${c.border} ${c.text} font-bold text-[10px] uppercase tracking-wider`}>
                {c.label}
            </span>
        );
    };

    const normalizePaymentMethodLabel = (booking: ExtendedBooking) => {
        const raw: string | undefined =
            booking.paymentMethod ||
            booking.payment_method ||
            booking.paymentProvider ||
            booking.payment_provider ||
            booking.gateway ||
            booking.paymentGateway;

        if (raw && raw !== "-") {
            const lowered = String(raw).toLowerCase();
            if (lowered.includes("wallet")) return "Wallet";
            if (lowered.includes("stripe")) return "Stripe";
            if (lowered.includes("razor")) return "Razorpay";
            if (lowered.includes("paypal")) return "PayPal";
            return String(raw);
        }

        if (booking.usedWallet || booking.walletTransactionId || booking.walletTxnId) return "Wallet";
        if (booking.stripePaymentIntentId || booking.stripeSessionId) return "Stripe";

        const paymentId: string | undefined = booking.payment_id || booking.paymentId || booking.razorpayPaymentId;
        if (paymentId) {
            if (String(paymentId).startsWith("pi_") || String(paymentId).startsWith("cs_")) return "Stripe";
            return "Razorpay";
        }

        return "-";
    };

    const startChatWithVendor = async (booking: ExtendedBooking) => {
        if (!user?.id) {
            toast.error("Please log in to start a chat.");
            return;
        }
        const vendorId = booking.selectedPackage?.vendorId || booking.selectedPackage?.ownerId;
        if (!vendorId) {
            toast.error("Vendor not found.");
            return;
        }
        try {
            const chatResponse = await findOrCreateChat(user.id, vendorId, 'user');
            let chatId = null;

            if (chatResponse?.data?._id) chatId = chatResponse.data._id;
            else if (chatResponse?._id) chatId = chatResponse._id;
            else if (chatResponse?.data?.id) chatId = chatResponse.data.id;
            else if (chatResponse?.id) chatId = chatResponse.id;

            if (chatId) navigate(`/chat/${chatId}`);
            else toast.error("Failed to initiate chat.");
        } catch (error: unknown) {
            console.error("Error starting chat:", error);
            toast.error((error as Error).message || "Failed to start chat.");
        }
    };

    const shouldShowChatButton = (booking: ExtendedBooking) => {
        if (!booking) return false;
        const status = getBookingStatus(booking);
        return status === "upcoming" &&
            booking.bookingStatus?.toLowerCase() !== "cancelled" &&
            booking.bookingStatus?.toLowerCase() !== "rejected";
    };

    const openCancelModal = () => {
        setIsCancelModalOpen(true);
    };

    const handleCancelBooking = async (reason: string) => {
        try {
            const res = await cancelBooking(booking._id, reason);
            if (res?.success === true || res?.data) {
                toast.success("Booking cancelled successfully");
                navigate("/bookings");
            } else throw new Error(res?.message || "Failed");
        } catch (err: unknown) {
            toast.error((err as Error).message || "Failed to cancel.");
        }
    };

    const openRescheduleModal = () => {
        setIsRescheduleOpen(true);
    };

    const handleRescheduleSuccess = async () => {
        toast.success("Booking rescheduled! Redirecting...");
        setTimeout(() => navigate("/bookings"), 1500);
    };

    const openReviewModal = (booking: ExtendedBooking) => {
        const pkg = booking.selectedPackage;
        if (pkg && pkg._id && pkg.packageName) {
            setReviewPackage({
                packageId: pkg._id,
                packageName: pkg.packageName,
                destination: pkg.destination || "Unknown Destination",
            });
            setIsReviewModalOpen(true);
        } else toast.error("Package information unavailable");
    };

    const handleDownloadTicket = async () => {
        if (!ticketRef.current) return;

        setIsDownloading(true);
        try {
            // High-quality capture with optimized settings for PDF
            const dataUrl = await htmlToImage.toPng(ticketRef.current, {
                quality: 1,
                pixelRatio: 4,
                backgroundColor: "#ffffff",
                style: {
                    transform: 'scale(1)',
                    margin: '0',
                    padding: '0'
                },
                // Force a consistent width during capture for layout stability
                canvasWidth: 800,
            });

            const pdf = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(dataUrl);
            const ratio = imgProps.height / imgProps.width;

            // Calculate width and height to fit A4 perfectly
            const finalWidth = pdfWidth - 20; // 10mm margins
            const finalHeight = finalWidth * ratio;

            // Center vertically if there's room, otherwise start from top
            const yOffset = finalHeight < pdfHeight ? (pdfHeight - finalHeight) / 2 : 10;
            const xOffset = 10; // Left margin

            pdf.addImage(dataUrl, "PNG", xOffset, yOffset, finalWidth, finalHeight);

            // Add a subtle footer to the PDF page itself (optional but professional)
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text("This is an official digital document issued by OffWeGo Travels.", pdfWidth / 2, pdfHeight - 10, { align: "center" });

            pdf.save(`OffWeGo-Ticket-${booking._id.slice(-6).toUpperCase()}.pdf`);
            toast.success("Ticket downloaded successfully! 🚀");
        } catch (error) {
            console.error("PDF Generation failed:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header forceSolid />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-24"
            >
                {/* Top Navigation Bar */}
                <div className="sticky top-24 bg-white/80 backdrop-blur-md border-b border-gray-100 z-20">
                    <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/profile")}
                                className="p-2 hover:bg-gray-100 rounded-full transition-all group"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-black" />
                            </button>
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Booking Details</h2>
                                <p className="text-xs font-medium text-gray-400">Ref: {booking._id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(getBookingStatus(booking))}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Hero Section */}
                            <div className="relative h-80 rounded-[2.5rem] overflow-hidden group">
                                <img
                                    src={resolveCloudinaryUrl(booking.selectedPackage?.imageUrls?.[0], "image") || booking.selectedPackage?.imageUrls?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"}
                                    alt={booking.selectedPackage?.packageName || "Package"}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                                    <h1 className="text-4xl font-black mb-2 tracking-tight">{booking.selectedPackage?.packageName}</h1>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="w-4 h-4" />
                                        <span>{booking.selectedPackage?.destination || "Adventure Destination"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Schedule */}
                            <div className="p-8 bg-gray-50 rounded-[2rem] space-y-6">
                                <h3 className="text-xl font-black tracking-tight">Travel Schedule</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Departure Date</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm border border-gray-100">
                                                <span className="text-[9px] font-black">{new Date(booking.selectedDate).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                                <span className="text-xs font-bold">{new Date(booking.selectedDate).getDate()}</span>
                                            </div>
                                            <div>
                                                <p className="text-base font-black leading-none">{new Date(booking.selectedDate).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(booking.selectedDate).getFullYear()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Party */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black tracking-tight">Travel Party</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                                        <Users className="w-3 h-3 text-gray-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{(Array.isArray(booking.adults) ? booking.adults.length : 0) + (Array.isArray(booking.children) ? booking.children.length : 0)} Guest Party</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Array.isArray(booking.adults) && booking.adults.map((guest: Traveler, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-black transition-colors group">
                                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                                                <span className="text-xs font-black">{idx + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black">{guest.name || "Main Guest"}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adult Traveler</p>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{guest.gender || 'N/A'}</p>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Age: {guest.age || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {Array.isArray(booking.children) && booking.children.map((guest: Traveler, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-black transition-colors group">
                                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                                                <span className="text-xs font-black">C{idx + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black">{guest.name || "Junior Traveler"}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Child Traveler</p>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{guest.gender || 'N/A'}</p>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Age: {guest.age || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Travel Preparation */}
                            <div className="p-10 bg-black text-white rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
                                <div className="relative z-10 space-y-6">
                                    <h3 className="text-xl font-black tracking-tight">Travel Preparation</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Documents</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 leading-relaxed">Ensure physical IDs and digital copies of your booking are accessible offline.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Arrival</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 leading-relaxed">Please arrive at the assembly point at least 45 minutes before departure.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Packing</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 leading-relaxed">Check local weather forecasts and carry essentials matching the destination climate.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Toggle Section */}
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="space-y-1 text-center md:text-left">
                                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                            <Ticket className="w-5 h-5 text-emerald-500" />
                                            Official Travel Ticket
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium">Your verified booking document is ready for download.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowTicket(!showTicket)}
                                        className="px-6 py-3 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                                    >
                                        {showTicket ? "Hide Ticket" : "View Ticket"}
                                    </button>
                                </div>
                            </div>

                            {showTicket && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative"
                                >
                                    {/* Premium Boarding Pass Style Ticket */}
                                    <div id="printable-ticket" ref={ticketRef} className="relative max-w-[800px] mx-auto mt-8 mb-8">
                                        {/* Sawtooth Top Edge */}
                                        <div className="absolute top-0 left-0 w-full h-4 z-10" style={{
                                            backgroundImage: 'radial-gradient(circle at 10px -2px, transparent 10px, white 11px)',
                                            backgroundSize: '20px 20px',
                                            backgroundRepeat: 'repeat-x'
                                        }}></div>

                                        <div className="relative bg-white shadow-2xl overflow-hidden font-sans rounded-sm pt-12 border-x border-gray-100">
                                            <div className="flex">
                                                {/* Main Ticket Area */}
                                                <div className="flex-[2.5] p-10 pr-6 border-r-2 border-dashed border-gray-100 relative">
                                                    {/* Subtle Pattern Background */}
                                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                                    <div className="relative z-10 space-y-10">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <h2 className="text-4xl font-serif text-black tracking-tight leading-none">Booking Confirmation</h2>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Official Trip Document & Passenger Ticket</p>
                                                            </div>
                                                            <div className="bg-black p-3 rounded-xl">
                                                                <img src="/images/logo.png" alt="OffWeGo" className="h-6 w-auto object-contain brightness-0 invert" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div>
                                                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Package / Destination</p>
                                                                <h3 className="text-2xl font-black text-black leading-tight max-w-[400px]">
                                                                    {booking.selectedPackage?.packageName}
                                                                </h3>
                                                                <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {booking.selectedPackage?.destination || "Adventure Destination"}
                                                                </p>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Passenger Name</p>
                                                                    <p className="text-sm font-black text-black uppercase">{user?.username || "Traveler"}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Travel Party</p>
                                                                    <p className="text-sm font-black text-black">
                                                                        {(Array.isArray(booking.adults) ? booking.adults.length : 0) + (Array.isArray(booking.children) ? booking.children.length : 0)} People
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Email Registered</p>
                                                                    <p className="text-[11px] font-bold text-gray-600 truncate max-w-[180px]">{booking.contactInfo?.email || user?.email}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Contact Number</p>
                                                                    <p className="text-[11px] font-bold text-gray-600">{booking.contactInfo?.mobile || user?.phone || "N/A"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Ticket Stub Area */}
                                                <div className="flex-1 bg-gray-50/50 p-10 pl-8 flex flex-col justify-between items-center text-center">
                                                    <div className="space-y-6 w-full">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Departure</p>
                                                            <div className="space-y-0">
                                                                <p className="text-5xl font-black text-black leading-none">{new Date(booking.selectedDate).getDate()}</p>
                                                                <p className="text-xs font-black text-black uppercase">{new Date(booking.selectedDate).toLocaleString('default', { month: 'long' })}</p>
                                                                <p className="text-[10px] font-bold text-gray-400">{new Date(booking.selectedDate).getFullYear()}</p>
                                                            </div>
                                                        </div>

                                                        <div className="w-full h-px bg-gray-200"></div>

                                                        <div className="space-y-2">
                                                            <div className="w-24 h-24 bg-white border border-gray-100 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                                                                {/* QR Code Placeholder with brand color */}
                                                                <div className="w-full h-full bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center">
                                                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px' }}></div>
                                                                    <Sparkles className="w-6 h-6 text-emerald-500 relative z-10" />
                                                                    <p className="text-[6px] font-black text-black mt-1 z-10">VALID ENTRY</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Scan for Verification</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">Reference</p>
                                                        <p className="text-xl font-black font-mono" style={{ color: '#10b981' }}>{booking._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* High Contrast Informational Footer */}
                                            <div className="relative overflow-hidden" style={{ backgroundColor: '#10b981' }}>
                                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
                                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
                                                {/* Dash connecting cutouts */}
                                                <div className="absolute left-4 right-4 top-1/2 border-t border-dashed border-white/30"></div>

                                                <div className="p-8 px-12 relative z-10 flex flex-col md:flex-row items-center justify-between text-white gap-8 font-sans">
                                                    <div className="space-y-4 text-center md:text-left">
                                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                                            <div className="px-3 py-1 bg-black rounded-full shadow-lg">
                                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">Electronic Ticket Verified</span>
                                                            </div>
                                                            <div className="h-6 w-px bg-white/20 hidden md:block"></div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Paid in Full: ₹{booking.totalAmount?.toLocaleString()}</p>
                                                        </div>
                                                        <p className="text-[9px] font-medium opacity-80 leading-relaxed max-w-[400px]">
                                                            Please present this ticket at the assembly point 45 minutes before departure. This document serves as your official proof of purchase and entry permit.
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                                                        <div className="py-1">
                                                            <img src="/images/logo.png" alt="OffWeGo" className="h-8 w-auto object-contain brightness-0 invert" />
                                                        </div>
                                                        <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
                                                            <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-100 italic leading-none mb-1">Pass ID</p>
                                                            <p className="text-2xl font-black tracking-widest font-mono text-center">{booking._id.slice(-6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sawtooth Bottom Edge */}
                                        <div className="absolute bottom-0 left-0 w-full h-4 z-10 rotate-180" style={{
                                            backgroundImage: 'radial-gradient(circle at 10px -2px, transparent 10px, #10b981 11px)',
                                            backgroundSize: '20px 20px',
                                            backgroundRepeat: 'repeat-x'
                                        }}></div>
                                    </div>

                                    <div className="flex justify-center mb-12 no-print">
                                        <button
                                            onClick={handleDownloadTicket}
                                            disabled={isDownloading}
                                            className="flex items-center gap-3 px-8 py-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 rounded-full transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200"
                                        >
                                            {isDownloading ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                    </motion.div>
                                                    Generating PDF...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4" />
                                                    Download Ticket PDF
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar Details */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Payment Summary */}
                            <div className="bg-black text-white rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Financial Summary</p>
                                    <h4 className="text-3xl font-black">₹{booking.totalAmount?.toLocaleString()}</h4>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Method</span>
                                        <span className="text-xs font-black">{normalizePaymentMethodLabel(booking)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Status</span>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Authorized</span>
                                    </div>
                                </div>

                                <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic border-t border-white/5 pt-4">
                                    Charges are inclusive of GST and local taxes. All transactions are secure and encrypted.
                                </p>
                            </div>

                            {/* Actions Section */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Management</p>

                                {shouldShowChatButton(booking) && (
                                    <button
                                        onClick={() => startChatWithVendor(booking)}
                                        className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white rounded-[1.5rem] transition-all group font-black text-xs uppercase tracking-widest"
                                    >
                                        <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                        Chat with Vendor
                                    </button>
                                )}

                                {booking.bookingStatus?.toLowerCase() !== "cancelled" && (
                                    <>
                                        <button
                                            onClick={openRescheduleModal}
                                            className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white rounded-[1.5rem] transition-all group font-black text-xs uppercase tracking-widest"
                                        >
                                            <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                            Reschedule Trip
                                        </button>
                                        <button
                                            onClick={openCancelModal}
                                            className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-500 hover:text-white rounded-[1.5rem] transition-all group font-black text-xs uppercase tracking-widest text-red-500"
                                        >
                                            <XCircle className="w-4 h-4 text-red-300 group-hover:text-white" />
                                            Cancel Reservation
                                        </button>
                                    </>
                                )}

                                {getBookingStatus(booking) === "completed" && (
                                    <button
                                        onClick={() => openReviewModal(booking)}
                                        className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white rounded-[1.5rem] transition-all group font-black text-xs uppercase tracking-widest"
                                    >
                                        <Star className="w-4 h-4 text-amber-500 group-hover:text-white" />
                                        Share Experience
                                    </button>
                                )}
                            </div>

                            {/* Contact Info Card */}
                            <div className="p-8 bg-gray-50 rounded-[2rem] space-y-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Details</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Mail className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 truncate">{booking.contactInfo?.email || user?.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">{booking.contactInfo?.mobile || user?.phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Help Center Section */}
                            <div className="p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-[2rem] space-y-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest">Safe Travel Help</h4>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Want to know more about our journey and commitment to safe travels?</p>
                                <button
                                    onClick={() => navigate("/about")}
                                    className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Learn About Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div >

            {/* SUB-MODALS - Rendered via portal */}
            {
                createPortal(
                    <>
                        <RescheduleModal open={isRescheduleOpen} onClose={() => setIsRescheduleOpen(false)} bookingId={booking._id} currentDate={booking.selectedDate ? new Date(booking.selectedDate).toISOString() : undefined} onSuccess={handleRescheduleSuccess} />
                        <CancelBookingModal open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} bookingId={booking._id} onConfirm={handleCancelBooking} />
                        {reviewPackage && <ReviewModal open={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setReviewPackage(null); }} packageName={reviewPackage.packageName} destination={reviewPackage.destination} onSuccess={() => navigate("/bookings")} />}
                    </>,
                    document.body
                )
            }
        </div >
    );
};

export default BookingDetailsPage;
