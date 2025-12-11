import { useState, useEffect, useRef } from "react";
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
  MoreVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import {
  cancelBooking,
  getUserBookings,
  rescheduleBooking,
} from "@/services/Booking/bookingService";
import { findOrCreateChat } from "@/services/chat/chatService";
import { ConfirmModal } from "@/components/Modular/ConfirmModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const RescheduleModal = ({
  open,
  onClose,
  bookingId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess?: () => void;
}) => {
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!newDate) {
      toast.error("Please select a new date");
      return;
    }

    try {
      setLoading(true);
      await rescheduleBooking(bookingId, newDate);
      console.log(bookingId, "iiiiiii")

      toast.success("Booking rescheduled successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Reschedule error:", error);
      toast.error(error?.message || "Failed to reschedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <RefreshCw className="w-7 h-7 text-emerald-600" />
            Reschedule Booking
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Choose New Travel Date</label>
            <input
              type="date"
              className="w-full mt-2 p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
              value={newDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !newDate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
          >
            {loading ? "Rescheduling..." : "Confirm Reschedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const BookingDetailsSection = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cancel Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  // Reschedule Modal
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

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
          (a: any, b: any) =>
            new Date(b.selectedDate).getTime() - new Date(a.selectedDate).getTime()
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
  console.log(bookings, "Book")
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
  const bookingIds = filteredBookings.map((booking) => booking.bookingId);

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
      const chatResponse = await findOrCreateChat(user.id, vendorId);
      // The response structure is: { success: true, data: { _id: "...", name: "...", ... } }
      const chat = chatResponse?.data || chatResponse;
      const chatId = chat?._id || chat?.id;
      
      if (chatId) {
        // Navigate to chat - the chat component will load vendor info
        navigate(`/chat/${chatId}`);
      } else {
        console.error("Chat created but no ID returned:", chatResponse);
        toast.error("Chat created but failed to open. Please try again.");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      toast.error(err?.message || "Failed to start chat. Please try again.");
    }
  };

  const shouldShowChatButton = (booking: any) => {
    const status = getBookingStatus(booking);
    const vendorId = booking.selectedPackage?.vendorId || booking.selectedPackage?.ownerId;
    return vendorId && ["upcoming", "ongoing"].includes(status);
  };


  const openCancelModal = (id: string) => {
    setBookingToCancel(id);
    setIsConfirmOpen(true);
  };
  console.log(bookingToCancel, "cancel")
  const confirmCancel = async () => {
    if (!bookingIds[0]) return;
    try {
      setLoading(true);
      const res = await cancelBooking(bookingIds[0]);
      console.log(res, "res")
      const updated = await getUserBookings();
      setBookings(updated || []);
      if (selectedBooking?._id === bookingToCancel) {
        setIsModalOpen(false);
        setSelectedBooking(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking.");
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
      setBookingToCancel(null);
    }
  };


  const openRescheduleModal = (bookingId: string) => {
    setBookingToReschedule(bookingId);
    setIsRescheduleOpen(true);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-xl">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-gray-950 transition-all shadow-lg font-semibold"
                >
                  <Home className="w-6 h-6" /> Home
                </button>
                <div className="flex items-center gap-4">
                  <Package className="w-10 h-10 text-gray-800" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    My Bookings
                  </h1>
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-3 border-2 border-gray-400 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-gray-200 text-lg font-medium"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-2xl" style={{ overflow: 'visible' }}>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-32">
                <Calendar className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">No Bookings Yet</h2>
                <p className="text-xl text-gray-600 mb-8">Start your next adventure!</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-10 py-5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xl font-bold rounded-xl hover:from-gray-900 hover:to-gray-950 transition-all shadow-xl"
                >
                  Explore Packages
                </button>
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
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <th className="px-8 py-6 text-left text-lg font-bold">Package</th>
                      <th className="px-8 py-6 text-left text-lg font-bold">Date</th>
                      <th className="px-8 py-6 text-left text-lg font-bold">Guests</th>
                      <th className="px-8 py-6 text-left text-lg font-bold">Amount</th>
                      <th className="px-8 py-6 text-center text-lg font-bold">Status</th>
                      <th className="px-8 py-6 text-center text-lg font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => {
                      const status = getBookingStatus(booking);
                      return (
                        <tr
                          key={booking._id}
                          className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all duration-200 border-b-2 border-gray-100`}
                        >
                          <td className="px-8 py-6 font-bold text-gray-900 text-lg">
                            {booking.selectedPackage?.packageName || "N/A"}
                          </td>
                          <td className="px-8 py-6 text-gray-700 font-semibold">
                            {new Date(booking.selectedDate).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex gap-3">
                              <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-bold">
                                {(booking.adults?.length || 0)} Adults
                              </span>
                              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                                {(booking.children?.length || 0)} Children
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-2xl font-bold text-gray-900">
                            ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="px-8 py-6 text-center">
                            {getStatusBadge(status)}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center">
                              <button
                                ref={(el) => {
                                  if (el) buttonRefs.current[booking._id] = el;
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const button = buttonRefs.current[booking._id];
                                  if (button) {
                                    const rect = button.getBoundingClientRect();
                                    setMenuPosition({
                                      top: rect.bottom + window.scrollY + 8,
                                      left: rect.right + window.scrollX - 224, // 224 = w-56 (14rem)
                                    });
                                  }
                                  setOpenMenuId(openMenuId === booking._id ? null : booking._id);
                                }}
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                                title="Actions"
                                  >
                                <MoreVertical className="w-6 h-6 text-gray-700" />
                                  </button>
                            </div>
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
                        openRescheduleModal(booking.bookingId);
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
                        navigate("/review");
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
                  <p className="text-2xl font-bold text-gray-800">
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
                  <button
                    onClick={() => { setIsModalOpen(false); openCancelModal(selectedBooking._id); }}
                    className="px-10 py-5 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                  >
                    <X className="w-8 h-8" /> Cancel Booking
                  </button>
                )}

                {getBookingStatus(selectedBooking) === "completed" && (
                  <>
                    <button
                      onClick={() => navigate("/review")}
                      className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                    >
                      <Star className="w-8 h-8" /> Write Review
                    </button>
                    <button
                      onClick={() => { setIsModalOpen(false); openRescheduleModal(selectedBooking._id); }}
                      className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center gap-4"
                    >
                      <RefreshCw className="w-8 h-8" /> Reschedule Trip
                    </button>
                  </>
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This cannot be undone."
        confirmText="Yes, Cancel"
        onConfirm={confirmCancel}
        onCancel={() => {
          setIsConfirmOpen(false);
          setBookingToCancel(null);
        }}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        open={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setBookingToReschedule(null);
        }}
        bookingId={bookingToReschedule || ""}
        onSuccess={handleRescheduleSuccess}
      />
    </>
  );
};

export default BookingDetailsSection;