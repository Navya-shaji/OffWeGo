import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Package,
  Home,
  Star,
  X,
  Eye,
  MapPin,
  Users,
  Clock,
  CreditCard,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { getsingleDestination } from "@/services/Destination/destinationService";
import {
  cancelBooking,
  getUserBookings,
  rescheduleBooking,
} from "@/services/Booking/bookingService";
import { findOrCreateChat } from "@/services/chat/chatService";
import { CancelBookingModal } from "@/components/Modular/CancelBookingModal";
import { ReviewModal } from "@/components/Modular/ReviewModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

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
    } catch (error: any) {
      console.error("Reschedule error:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to reschedule. Please try again.");
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
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <RefreshCw className="w-7 h-7 text-emerald-600" />
            Reschedule Booking
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-5">
          {currentDate && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium">
                Current booking date: {new Date(currentDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose New Travel Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-lg ${
                error
                  ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
              }`}
              value={newDate}
              min={currentDate 
                ? (() => {
                    const min = new Date(currentDate);
                    min.setDate(min.getDate() + 1);
                    return min.toISOString().split("T")[0];
                  })()
                : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              onChange={(e) => {
                setNewDate(e.target.value);
                setError("");
              }}
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


const BookingDetailsSection = ({ embedded = false }: { embedded?: boolean }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cancel Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Reschedule Modal
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState<string | null>(null);
  const [rescheduleCurrentDate, setRescheduleCurrentDate] = useState<string | undefined>(undefined);

  // Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewPackage, setReviewPackage] = useState<{
    packageId: string;
    packageName: string;
    destination: string;
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const [destinationNameById, setDestinationNameById] = useState<Record<string, string>>({});

  const isMongoObjectId = (value: unknown) => {
    if (typeof value !== "string") return false;
    return /^[a-f\d]{24}$/i.test(value);
  };

  const normalizePaymentMethodLabel = (booking: any) => {
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

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserBookings();
        const sorted = (data || []).sort(
          (a: any, b: any) => {
            const bookingDateA = new Date(a.createdAt || a.bookingDate || a.selectedDate);
            const bookingDateB = new Date(b.createdAt || b.bookingDate || b.selectedDate);
            return bookingDateA.getTime() - bookingDateB.getTime();
          }
        );
        setBookings(sorted);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id]);

  useEffect(() => {
    const destinationIds = new Set<string>();

    for (const booking of bookings) {
      const destinationObj = booking?.selectedPackage?.destination;
      const destinationIdFromPackage = booking?.selectedPackage?.destinationId;

      if (typeof destinationObj === "string" && isMongoObjectId(destinationObj)) destinationIds.add(destinationObj);
      if (typeof destinationObj === "object" && destinationObj?._id && isMongoObjectId(destinationObj._id)) destinationIds.add(destinationObj._id);

      if (typeof destinationIdFromPackage === "string" && isMongoObjectId(destinationIdFromPackage)) destinationIds.add(destinationIdFromPackage);
      if (typeof destinationIdFromPackage === "object" && destinationIdFromPackage?._id && isMongoObjectId(destinationIdFromPackage._id)) destinationIds.add(destinationIdFromPackage._id);

      if (typeof booking?.destinationId === "string" && isMongoObjectId(booking.destinationId)) destinationIds.add(booking.destinationId);
    }

    const idsToFetch = [...destinationIds].filter((id) => !destinationNameById[id]);
    if (idsToFetch.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const results = await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const res = await getsingleDestination(id);
              const data = res?.data || res;
              const name =
                data?.destination?.name ||
                data?.destination?.destinationName ||
                data?.name ||
                data?.destinationName ||
                data?.data?.name ||
                data?.data?.destinationName;
              return { id, name: typeof name === "string" && name.trim() ? name : undefined };
            } catch {
              return { id, name: undefined };
            }
          })
        );

        if (cancelled) return;

        setDestinationNameById((prev) => {
          const next = { ...prev };
          for (const r of results) {
            if (r.name) next[r.id] = r.name;
          }
          return next;
        });
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookings, destinationNameById]);

  const getBookingStatus = (booking: any) => {
    if (booking.bookingStatus?.toLowerCase() === "cancelled") return "cancelled";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(booking.selectedDate);
    startDate.setHours(0, 0, 0, 0);

    const duration = booking.selectedPackage?.duration || 1;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration - 1);
    endDate.setHours(23, 59, 59, 999);

    if (endDate < today) return "completed";
    if (startDate > today) return "upcoming";
    return "ongoing";
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      upcoming: { bg: "bg-blue-100", text: "text-blue-800", icon: <Clock className="w-4 h-4" />, label: "Upcoming" },
      ongoing: { bg: "bg-green-100", text: "text-green-800", icon: <AlertCircle className="w-4 h-4" />, label: "Ongoing" },
      completed: { bg: "bg-gray-100", text: "text-gray-800", icon: <CheckCircle className="w-4 h-4" />, label: "Completed" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: <XCircle className="w-4 h-4" />, label: "Cancelled" },
    };
    const c = config[status] || config.upcoming;
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${c.bg} ${c.text} font-bold text-sm`}>
        {c.icon} {c.label}
      </span>
    );
  };

  const filteredBookings = filterStatus === "all"
    ? bookings
    : bookings.filter(b => getBookingStatus(b) === filterStatus);

  const startChatWithVendor = async (booking: any) => {
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
      console.log("Starting chat with vendor:", { userId: user.id, vendorId });
      const chatResponse = await findOrCreateChat(user.id, vendorId, 'user');
      console.log("Chat response:", chatResponse);
      
      // Handle different response structures
      let chatId = null;
      
      if (chatResponse?.data?._id) {
        chatId = chatResponse.data._id;
      } else if (chatResponse?._id) {
        chatId = chatResponse._id;
      } else if (chatResponse?.data?.id) {
        chatId = chatResponse.data.id;
      } else if (chatResponse?.id) {
        chatId = chatResponse.id;
      }
      
      console.log("Extracted chat ID:", chatId);
      
      if (chatId) {
        // Navigate to chat - the chat component will load vendor info
        navigate(`/chat/${chatId}`);
      } else {
        console.error("No chat ID found in response:", chatResponse);
        toast.error("Chat session created but no valid chat ID found.");
      }
    } catch (error: any) {
      console.error("Error starting chat:", error);
      toast.error(error.message || "Failed to start chat.");
    }
  };

  const shouldShowChatButton = (booking: any) => {
    // Show chat button for upcoming bookings that are not cancelled
    if (!booking) return false;
    
    const status = getBookingStatus(booking);
    return status === "upcoming" && 
           booking.bookingStatus?.toLowerCase() !== "cancelled" && 
           booking.bookingStatus?.toLowerCase() !== "rejected";
  };

  const openCancelModal = (id: string) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
  };

  const handleCancelBooking = async (reason: string) => {
    if (!bookingToCancel) return;
    try {
      setLoading(true);
      const res = await cancelBooking(bookingToCancel, reason);
      console.log(res, "res");
      
      // Check for success response (backend returns { success: true, data: booking })
      if (res?.success === true || res?.data) {
        toast.success("Booking cancelled successfully");
        
        // Immediately update local state for instant UI feedback
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingToCancel 
              ? { ...booking, bookingStatus: 'cancelled' }
              : booking
          )
        );
        
        // Also fetch fresh data to ensure consistency
        try {
          const updated = await getUserBookings();
          setBookings(updated || []);
        } catch (fetchError) {
          console.error("Error fetching updated bookings:", fetchError);
          // Keep local state update if fetch fails
        }
        
        if (selectedBooking?._id === bookingToCancel) {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }
      } else {
        throw new Error(res?.message || "Failed to cancel booking");
      }
    } catch (err: any) {
      console.error("Cancel booking error:", err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to cancel booking.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openRescheduleModal = (bookingId: string, currentDate?: string) => {
    setBookingToReschedule(bookingId);
    setRescheduleCurrentDate(currentDate);
    setIsRescheduleOpen(true);
  };

  const openReviewModal = (booking: any) => {
    const pkg = booking.selectedPackage;
    if (pkg && pkg._id && pkg.packageName) {
      setReviewPackage({
        packageId: pkg._id,
        packageName: pkg.packageName,
        destination: pkg.destination || pkg.destinationId || "Unknown Destination",
      });
      setIsReviewModalOpen(true);
    } else {
      toast.error("Package information not available");
    }
  };

  const handleRescheduleSuccess = async () => {
    const updated = await getUserBookings();
    setBookings(updated || []);
    setIsRescheduleOpen(false);
    setBookingToReschedule(null);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className={embedded ? "flex items-center justify-center py-14" : "flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"}>
        <div className="text-center">
          <div className={embedded ? "animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-gray-800 mx-auto mb-3" : "animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"}></div>
          <p className={embedded ? "text-gray-600 font-medium" : "text-gray-600 font-medium text-xl"}>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  const header = (
    <div className={embedded ? "flex flex-col md:flex-row justify-between items-start md:items-center gap-4" : "flex flex-col md:flex-row justify-between items-start md:items-center gap-6"}>
      <div className={embedded ? "flex items-center gap-3" : "flex items-center gap-6"}>
        {!embedded && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-gray-950 transition-all shadow-lg font-semibold"
          >
            <Home className="w-6 h-6" /> Home
          </button>
        )}
        <div className={embedded ? "flex items-center gap-3" : "flex items-center gap-4"}>
          <Package className={embedded ? "w-6 h-6 text-gray-800" : "w-10 h-10 text-gray-800"} />
          <h1 className={embedded ? "text-xl font-bold text-gray-900" : "text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent"}>
            My Bookings
          </h1>
        </div>
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className={embedded ? "px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm font-medium" : "px-6 py-3 border-2 border-gray-400 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-gray-200 text-lg font-medium"}
      >
        <option value="all">All Bookings</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );

  const bookingsBody = (
    <div className={embedded ? "" : "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6"}>
      <div className={embedded ? "" : "max-w-7xl mx-auto"}>
        <div className={embedded ? "mb-6" : "bg-white rounded-2xl shadow-xl p-8 mb-8"}>
          {header}
        </div>

        <div className={embedded ? "bg-white rounded-2xl border border-gray-200" : "bg-white rounded-2xl shadow-2xl"} style={{ overflow: 'visible' }}>
          {filteredBookings.length === 0 ? (
            <div className={embedded ? "text-center py-16" : "text-center py-32"}>
              <Calendar className={embedded ? "w-12 h-12 text-gray-300 mx-auto mb-4" : "w-24 h-24 text-gray-400 mx-auto mb-6"} />
              <h2 className={embedded ? "text-lg font-semibold text-gray-900 mb-2" : "text-3xl font-bold text-gray-800 mb-4"}>No Bookings Yet</h2>
              <p className={embedded ? "text-sm text-gray-500" : "text-xl text-gray-600 mb-8"}>Start your next adventure!</p>
              {!embedded && (
                <button
                  onClick={() => navigate("/")}
                  className="px-10 py-5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xl font-bold rounded-xl hover:from-gray-900 hover:to-gray-950 transition-all shadow-xl"
                >
                  Explore Packages
                </button>
              )}
            </div>
          ) : (
            <div
              className="overflow-x-auto"
              style={{
                overflowY: 'visible',
                maxHeight: 'none'
              }}
            >
              <style>{`
                  div.overflow-x-auto::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                  }
                  div.overflow-x-auto {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}</style>
              <table className="w-full">
                <thead>
                  <tr className={embedded ? "bg-gray-900 text-white" : "bg-gradient-to-r from-gray-800 to-gray-900 text-white"}>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Booking ID</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Package</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Destination</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Travel Date</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Booked On</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Guests</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Amount</th>
                    <th className={embedded ? "px-5 py-4 text-left text-sm font-semibold" : "px-8 py-6 text-left text-lg font-bold"}>Payment</th>
                    <th className={embedded ? "px-5 py-4 text-center text-sm font-semibold" : "px-8 py-6 text-center text-lg font-bold"}>Status</th>
                    <th className={embedded ? "px-5 py-4 text-center text-sm font-semibold" : "px-8 py-6 text-center text-lg font-bold"}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => {
                    const status = getBookingStatus(booking);
                    const adultsCount = Array.isArray(booking.adults) ? booking.adults.length : (typeof booking.adults === "number" ? booking.adults : 0);
                    const childrenCount = Array.isArray(booking.children) ? booking.children.length : (typeof booking.children === "number" ? booking.children : 0);
                    const computedGuests = (adultsCount || childrenCount) ? (adultsCount + childrenCount) : (booking.guestCount || booking.numberOfPeople || 0);
                    const destinationObj = booking.selectedPackage?.destination;
                    const destinationId =
                      (typeof destinationObj === "object" && destinationObj?._id ? destinationObj._id : undefined) ||
                      (typeof booking.selectedPackage?.destinationId === "string" ? booking.selectedPackage.destinationId : undefined) ||
                      (typeof booking.selectedPackage?.destinationId === "object" && booking.selectedPackage?.destinationId?._id ? booking.selectedPackage.destinationId._id : undefined) ||
                      (typeof destinationObj === "string" ? destinationObj : undefined) ||
                      (typeof booking.destinationId === "string" ? booking.destinationId : undefined);

                    const destinationNameFromBooking =
                      (typeof destinationObj === "object" && (destinationObj?.name || destinationObj?.destinationName)
                        ? (destinationObj?.name || destinationObj?.destinationName)
                        : undefined) ||
                      (typeof booking.destination === "string" && !isMongoObjectId(booking.destination)
                        ? booking.destination
                        : undefined) ||
                      booking.destinationName;

                    const destination =
                      destinationNameFromBooking ||
                      (destinationId && destinationNameById[destinationId] ? destinationNameById[destinationId] : undefined) ||
                      (destinationId && isMongoObjectId(destinationId) ? "Loading..." : undefined) ||
                      "-";
                    const bookedOn = booking.createdAt || booking.bookingDate || booking.selectedDate;
                    const paymentMethod = normalizePaymentMethodLabel(booking);
                    return (
                      <tr
                        key={booking._id}
                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all duration-200 border-b border-gray-100`}
                      >
                        <td className={embedded ? "px-5 py-4 text-gray-900 font-semibold text-sm" : "px-8 py-6 text-gray-900 font-bold"}>
                          <div className="max-w-[14rem]">
                            <p className="font-mono truncate">{booking.bookingId || booking._id || "-"}</p>
                          </div>
                        </td>
                        <td className={embedded ? "px-5 py-4 font-semibold text-gray-900 text-sm" : "px-8 py-6 font-bold text-gray-900 text-lg"}>
                          {booking.selectedPackage?.packageName || "N/A"}
                        </td>
                        <td className={embedded ? "px-5 py-4 text-gray-700 font-medium text-sm" : "px-8 py-6 text-gray-700 font-semibold"}>
                          <div className="max-w-[14rem] truncate">{destination}</div>
                        </td>
                        <td className={embedded ? "px-5 py-4 text-gray-700 font-medium text-sm" : "px-8 py-6 text-gray-700 font-semibold"}>
                          {new Date(booking.selectedDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: embedded ? "short" : "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className={embedded ? "px-5 py-4 text-gray-700 font-medium text-sm" : "px-8 py-6 text-gray-700 font-semibold"}>
                          {bookedOn
                            ? new Date(bookedOn).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className={embedded ? "px-5 py-4 text-gray-700 font-medium text-sm" : "px-8 py-6 text-gray-700 font-semibold"}>
                          <div className="whitespace-nowrap">
                            <span className="font-semibold">{computedGuests || "-"}</span>
                            {(adultsCount || childrenCount) ? (
                              <span className="ml-2 text-xs text-gray-500">(A:{adultsCount} C:{childrenCount})</span>
                            ) : null}
                          </div>
                        </td>
                        <td className={embedded ? "px-5 py-4 text-gray-900 font-semibold text-sm" : "px-8 py-6 text-gray-900 font-bold"}>
                          ₹{booking.totalAmount || booking.amount || "-"}
                        </td>
                        <td className={embedded ? "px-5 py-4 text-gray-700 font-semibold text-sm" : "px-8 py-6 text-gray-700 font-semibold"}>
                          {paymentMethod}
                        </td>
                        <td className={embedded ? "px-5 py-4 text-center" : "px-8 py-6 text-center"}>
                          {getStatusBadge(status)}
                        </td>
                        <td className={embedded ? "px-5 py-4 text-center" : "px-8 py-6 text-center"}>
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className={embedded ? "inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors" : "inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold hover:from-gray-900 hover:to-gray-950 transition-all shadow-lg"}
                          >
                            <Eye className={embedded ? "w-4 h-4" : "w-6 h-6"} />
                            <span className={embedded ? "ml-2" : "ml-3"}>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {bookingsBody}
      {/* Dropdown Menu Portal */}
      {openMenuId && menuPosition && filteredBookings.find((b) => b._id === openMenuId) && createPortal(
        <>
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => {
              setOpenMenuId(null);
              setMenuPosition(null);
            }}
          />
          <div 
            className="fixed w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[1000]"
            style={{ 
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const booking = filteredBookings.find((b) => b._id === openMenuId);
              if (!booking) return null;
              const status = getBookingStatus(booking);
              return (
                <div className="py-2">
                  {/* View Details - Always shown */}
                  <button
                    onClick={() => {
                      handleViewDetails(booking);
                      setOpenMenuId(null);
                      setMenuPosition(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-gray-800" />
                    <span className="font-medium text-gray-700">View Details</span>
                  </button>

                  {/* Chat - Only for upcoming trips */}
                  {status === "upcoming" && shouldShowChatButton(booking) && (
                    <button
                      onClick={() => {
                        startChatWithVendor(booking);
                        setOpenMenuId(null);
                        setMenuPosition(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-cyan-600" />
                      <span className="font-medium text-gray-700">Chat with Vendor</span>
                    </button>
                  )}

                  {/* Cancel - Only for upcoming trips */}
                  {status === "upcoming" && (
                    <button
                      onClick={() => {
                        openCancelModal(booking._id);
                        setOpenMenuId(null);
                        setMenuPosition(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-700">Cancel</span>
                    </button>
                  )}

                  {/* Reschedule - Only for upcoming trips */}
                  {status === "upcoming" && (
                    <button
                      onClick={() => {
                        openRescheduleModal(booking.bookingId, booking.selectedDate);
                        setOpenMenuId(null);
                        setMenuPosition(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-gray-700">Reschedule</span>
                    </button>
                  )}

                  {/* Rating - Only for completed trips */}
                  {status === "completed" && (
                    <button
                      onClick={() => {
                        openReviewModal(booking);
                        setOpenMenuId(null);
                        setMenuPosition(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Star className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-gray-700">Write Review</span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </>,
        document.body
      )}

      {/* FULL DETAILS MODAL */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-950 text-white p-8 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-6">
                <Package className="w-12 h-12" />
                <div>
                  <h2 className="text-4xl font-bold">Booking Details</h2>
                  <p className="text-xl opacity-90">ID: {selectedBooking.bookingId}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-4 hover:bg-white/20 rounded-2xl transition-all"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="flex justify-between items-center">
                {getStatusBadge(getBookingStatus(selectedBooking))}
                <div className="text-right">
                  <p className="text-gray-600 font-semibold">Booked On</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(selectedBooking.createdAt || selectedBooking.selectedDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border-2 border-gray-200">
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-4">
                  <Package className="w-10 h-10 text-gray-800" /> Package Information
                </h3>
                <div className="grid md:grid-cols-2 gap-8 text-xl">
                  <div><p className="text-gray-600">Package Name</p><p className="font-bold text-2xl">{selectedBooking.selectedPackage?.packageName}</p></div>
                  <div><p className="text-gray-600">Destination</p><p className="font-bold text-2xl flex items-center gap-3"><MapPin className="w-7 h-7 text-gray-800" /> {selectedBooking.selectedPackage?.destination}</p></div>
                  <div><p className="text-gray-600">Duration</p><p className="font-bold text-2xl flex items-center gap-3"><Clock className="w-7 h-7 text-gray-800" /> {selectedBooking.selectedPackage?.duration} Days</p></div>
                  <div><p className="text-gray-600">Travel Date</p><p className="font-bold text-2xl flex items-center gap-3"><Calendar className="w-7 h-7 text-gray-800" /> {new Date(selectedBooking.selectedDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p></div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-4"><Users className="w-10 h-10 text-indigo-700" /> Guest Details</h3>
                {selectedBooking.adults?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-5">Adults ({selectedBooking.adults.length})</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {selectedBooking.adults.map((a: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border"><p className="text-xl font-bold">{a.name || `Adult ${i + 1}`}</p></div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBooking.children?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-5">Children ({selectedBooking.children.length})</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {selectedBooking.children.map((c: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border">
                          <p className="text-xl font-bold">{c.name || `Child ${i + 1}`}</p>
                          <p className="text-gray-600 mt-2">Age: {c.age || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBooking.contactInfo && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-3xl">
                    <h4 className="text-2xl font-bold mb-5">Contact Information</h4>
                    <div className="space-y-4 text-xl">
                      <p className="flex items-center gap-4"><Phone className="w-8 h-8 text-blue-700" /> {selectedBooking.contactInfo.mobile || "N/A"}</p>
                      <p className="flex items-center gap-4"><Mail className="w-8 h-8 text-blue-700" /> {selectedBooking.contactInfo.email || "N/A"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-emerald-300">
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-4"><CreditCard className="w-10 h-10 text-emerald-700" /> Payment Details</h3>
                <div className="grid md:grid-cols-2 gap-10 text-xl">
                  <div>
                    <p className="text-gray-600 text-2xl">Total Amount Paid</p>
                    <p className="text-5xl font-bold text-emerald-700 mt-3">
                      ₹{(selectedBooking.totalAmount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div><p className="text-gray-600">Payment ID</p><p className="font-mono bg-white px-6 py-3 rounded-xl border text-lg">{selectedBooking.payment_id || "N/A"}</p></div>
                    <div><p className="text-gray-600">Status</p><p className="font-bold text-emerald-700 text-2xl">{selectedBooking.paymentStatus || "Paid"}</p></div>
                    <div><p className="text-gray-600">Method</p><p className="font-bold text-xl">{selectedBooking.paymentMethod || "Online"}</p></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-6 pt-8 border-t-4 border-gray-200">
                {shouldShowChatButton(selectedBooking) && (
                  <button
                    onClick={() => startChatWithVendor(selectedBooking)}
                    className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                  >
                    <MessageCircle className="w-8 h-8" /> Chat with Vendor
                  </button>
                )}

                {getBookingStatus(selectedBooking) === "upcoming" && (
                  <>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        openRescheduleModal(selectedBooking.bookingId, selectedBooking.selectedDate);
                      }}
                      className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                    >
                      <RefreshCw className="w-8 h-8" /> Reschedule
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        openCancelModal(selectedBooking._id);
                      }}
                      className="px-10 py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                    >
                      <X className="w-8 h-8" /> Cancel Booking
                    </button>
                  </>
                )}

                {getBookingStatus(selectedBooking) === "completed" && (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      openReviewModal(selectedBooking);
                    }}
                    className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                  >
                    <Star className="w-8 h-8" /> Write Review
                  </button>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-5 bg-gray-200 text-gray-800 text-xl font-bold rounded-2xl hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        open={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setBookingToReschedule(null);
          setRescheduleCurrentDate(undefined);
        }}
        bookingId={bookingToReschedule || ""}
        currentDate={rescheduleCurrentDate}
        onSuccess={handleRescheduleSuccess}
      />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        open={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setBookingToCancel(null);
        }}
        bookingId={bookingToCancel || ""}
        onConfirm={handleCancelBooking}
      />

      {/* Review Modal */}
      {reviewPackage && (
        <ReviewModal
          open={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewPackage(null);
          }}
                    packageName={reviewPackage.packageName}
          destination={reviewPackage.destination}
          onSuccess={async () => {
            const updated = await getUserBookings();
            setBookings(updated || []);
          }}
        />
      )}
    </>
  );
};

export default BookingDetailsSection;