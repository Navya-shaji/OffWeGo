/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

import Header from "@/components/home/navbar/Header";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { createPortal } from "react-dom";
import {
  Calendar,
  Star,
  X,
  Eye,
  Users,
  AlertCircle,
  Package,
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
              className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-lg ${error
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

const BookingDetailsSection = ({ embedded = false, onAction }: { embedded?: boolean, onAction?: () => void }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


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
  const [visibleCount, setVisibleCount] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const [destinationNameById, setDestinationNameById] = useState<Record<string, string>>({});

  const isMongoObjectId = (value: unknown) => {
    if (typeof value !== "string") return false;
    return /^[a-f\d]{24}$/i.test(value);
  };

  useEffect(() => {
    setVisibleCount(10);
  }, [filterStatus]);

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
            return bookingDateB.getTime() - bookingDateA.getTime();
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
              const res = await getsingleDestination(id, { skipErrorToast: true });
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

  const filteredBookings = filterStatus === "all"
    ? bookings
    : bookings.filter(b => getBookingStatus(b) === filterStatus);

  const startChatWithVendor = async (booking: any) => {
    if (!user?.id) {
      toast.error("Please log in to start a chat.");
      return;
    }
    const vendorId = booking.vendorId || booking.selectedPackage?.vendorId || booking.selectedPackage?.ownerId;
    if (!vendorId) {
      toast.error("Vendor information missing. Cannot start chat.");
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
    } catch (error: any) {
      console.error("Error starting chat:", error);
      toast.error(error.message || "Failed to start chat.");
    }
  };

  const shouldShowChatButton = (booking: any) => {
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
      if (res?.success === true || res?.data) {
        toast.success("Booking cancelled successfully");
        setBookings(prev => prev.map(b => b._id === bookingToCancel ? { ...b, bookingStatus: 'cancelled' } : b));
        onAction?.();
      } else throw new Error(res?.message || "Failed");
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel.");
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
    } else toast.error("Package information unavailable");
  };

  const handleRescheduleSuccess = async () => {
    const updated = await getUserBookings();
    setBookings(updated || []);
    setIsRescheduleOpen(false);
  };

  const handleViewDetails = (booking: any) => {
    // Navigate to a separate booking details page
    navigate(`/bookings/${booking._id}`, { state: { booking } });
  };

  const handleMenuOpen = (event: React.MouseEvent, id: string) => {
    setOpenMenuId(id);
    setMenuPosition({
      top: event.clientY,
      left: event.clientX - 220
    });
  };

  if (loading) {
    return (
      <div className={embedded ? "flex items-center justify-center py-14" : "flex items-center justify-center min-h-screen bg-white"}>
        <div className="text-center">
          <LoadingSpinner size="lg" color="#000000" />
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Loading Trip Records...</p>
        </div>
      </div>
    );
  }

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-3">
        <Package className="w-6 h-6 text-black" />
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trip History</h2>
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-100 text-xs font-bold uppercase tracking-widest"
      >
        <option value="all">Alt Bookings</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );

  return (
    <div className={embedded ? "" : "min-h-screen bg-slate-50/50 p-6 pt-36"}>
      {!embedded && <Header forceSolid />}
      <div className={embedded ? "" : "max-w-7xl mx-auto"}>
        <div className="mb-10">{header}</div>

        <div className="relative">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Adventures Found</h3>
              <p className="text-sm text-gray-400">Time to plan your next great escape!</p>
            </div>
          ) : (
            <>
              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Package</th>
                        <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Destination</th>
                        <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Travel Date</th>
                        <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Guests</th>
                        <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Amount</th>
                        <th className="px-6 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Status</th>
                        <th className="px-6 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.slice(0, visibleCount).map((booking) => {
                        const status = getBookingStatus(booking);
                        const adultsCount = Array.isArray(booking.adults) ? booking.adults.length : (typeof booking.adults === "number" ? booking.adults : 0);
                        const childrenCount = Array.isArray(booking.children) ? booking.children.length : (typeof booking.children === "number" ? booking.children : 0);
                        const computedGuests = (adultsCount || childrenCount) ? (adultsCount + childrenCount) : (booking.guestCount || booking.numberOfPeople || 0);

                        // Extract Destination logic
                        const destObj = booking.selectedPackage?.destination;
                        const destId = (typeof destObj === "object" && destObj?._id) || booking.selectedPackage?.destinationId;
                        const destination = booking.selectedPackage?.destinationName ||
                          (typeof destObj === "object" && (destObj?.name || destObj?.destinationName)) ||
                          (typeof destId === "string" && destinationNameById[destId]) || "N/A";

                        return (
                          <tr key={booking._id} className="group hover:bg-gray-50/50 transition-all duration-300 border-b border-gray-100 last:border-0">
                            <td className="px-6 py-5">
                              <p className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-black transition-colors">
                                {booking.selectedPackage?.packageName || "N/A"}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-gray-500 font-medium text-xs truncate max-w-[120px]">{destination}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-gray-900 font-bold text-xs uppercase">
                                {new Date(booking.selectedDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                                <Users className="w-3 h-3 text-gray-400" />
                                <span className="text-[11px] font-bold text-gray-700">{computedGuests}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-gray-900 font-extrabold text-sm tracking-tighter">₹{(booking.totalAmount || 0).toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-5 text-center">{getStatusBadge(status)}</td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleViewDetails(booking)} className="p-2 hover:bg-black hover:text-white rounded-lg transition-all border border-gray-100"><Eye className="w-4 h-4" /></button>
                                <button onClick={(e) => handleMenuOpen(e, booking._id)} className="p-2 hover:bg-black hover:text-white rounded-lg transition-all border border-gray-100"><MoreVertical className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredBookings.length > visibleCount && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="px-10 py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Load More History
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PORTALS & MODALS */}
      {openMenuId && menuPosition && createPortal(
        <>
          <div className="fixed inset-0 z-[999]" onClick={() => setOpenMenuId(null)} />
          <div className="fixed w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1000] py-2" style={{ top: menuPosition.top, left: menuPosition.left }}>
            {(() => {
              const b = bookings.find(x => x._id === openMenuId);
              if (!b) return null;
              const s = getBookingStatus(b);
              return (
                <>
                  <button onClick={() => { handleViewDetails(b); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-xs font-bold uppercase tracking-wider"><Eye className="w-4 h-4" /> View Details</button>
                  {s === "upcoming" && shouldShowChatButton(b) && <button onClick={() => { startChatWithVendor(b); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-xs font-bold uppercase tracking-wider"><MessageCircle className="w-4 h-4 text-cyan-600" /> Chat Vendor</button>}
                  {s === "upcoming" && (
                    <>
                      <button onClick={() => { openRescheduleModal(b.bookingId, b.selectedDate); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-xs font-bold uppercase tracking-wider"><RefreshCw className="w-4 h-4 text-emerald-600" /> Reschedule</button>
                      <button onClick={() => { openCancelModal(b._id); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-xs font-bold uppercase tracking-wider"><X className="w-4 h-4 text-red-600" /> Cancel</button>
                    </>
                  )}
                  {s === "completed" && <button onClick={() => { openReviewModal(b); setOpenMenuId(null); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-xs font-bold uppercase tracking-wider"><Star className="w-4 h-4 text-amber-500" /> Write Review</button>}
                </>
              );
            })()}
          </div>
        </>,
        document.body
      )}





      {/* SUB-MODALS - Rendered via portal to appear above booking details modal */}
      {
        createPortal(
          <>
            <RescheduleModal open={isRescheduleOpen} onClose={() => setIsRescheduleOpen(false)} bookingId={bookingToReschedule || ""} currentDate={rescheduleCurrentDate} onSuccess={handleRescheduleSuccess} />
            <CancelBookingModal open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} bookingId={bookingToCancel || ""} onConfirm={handleCancelBooking} />
            {reviewPackage && <ReviewModal open={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setReviewPackage(null); }} packageName={reviewPackage.packageName} destination={reviewPackage.destination} onSuccess={async () => setBookings(await getUserBookings() || [])} />}
          </>,
          document.body
        )
      }
    </div >
  );
};

// Internal Import helper
const MoreVertical = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
  </svg>
);

export default BookingDetailsSection;