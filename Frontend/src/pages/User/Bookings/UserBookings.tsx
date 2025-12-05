import { useState, useEffect } from "react";
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


// ===================================================================
// RESCHEDULE MODAL (Clean UI)
// ===================================================================

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
    if (!newDate) return toast.error("Please select a new date");

    try {
      setLoading(true);
      await rescheduleBooking(bookingId, newDate);
      toast.success("Booking rescheduled successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reschedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl border shadow-sm p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-gray-700" /> Reschedule Booking
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <label className="text-sm text-gray-700 font-medium">Select New Date</label>
          <input
            type="date"
            value={newDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || !newDate}
            className="bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


// ===================================================================
// BOOKING DETAILS MAIN COMPONENT
// ===================================================================

const BookingDetailsSection = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");


  // ===================================================================
  // FETCH BOOKINGS
  // ===================================================================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(
          (data || []).sort(
            (a: any, b: any) =>
              new Date(b.selectedDate).getTime() - new Date(a.selectedDate).getTime()
          )
        );
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);


  // ===================================================================
  // BOOKING STATUS LOGIC
  // ===================================================================

  const getBookingStatus = (booking: any) => {
    if (booking.bookingStatus?.toLowerCase() === "cancelled") return "cancelled";

    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(booking.selectedDate).setHours(0, 0, 0, 0);

    const duration = booking.selectedPackage?.duration || 1;
    const end = new Date(booking.selectedDate);
    end.setDate(end.getDate() + duration - 1);

    if (end.getTime() < today) return "completed";
    if (start > today) return "upcoming";
    return "ongoing";
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      upcoming: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: <Clock className="w-4 h-4" />,
        label: "Upcoming",
      },
      ongoing: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Ongoing",
      },
      completed: {
        bg: "bg-gray-200",
        text: "text-gray-700",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      },
    };

    const c = config[status];
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${c.bg} ${c.text}`}
      >
        {c.icon} {c.label}
      </span>
    );
  };


  // ===================================================================
  // FILTER BOOKINGS
  // ===================================================================

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => getBookingStatus(b) === filterStatus);


  // ===================================================================
  // ACTION HANDLERS
  // ===================================================================

  const openCancelModal = (id: string) => {
    setBookingToCancel(id);
    setIsConfirmOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      await cancelBooking(bookingToCancel);
      const updated = await getUserBookings();
      setBookings(updated);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const openRescheduleModal = (id: string) => {
    setBookingToReschedule(id);
    setIsRescheduleOpen(true);
  };

  const handleRescheduleSuccess = async () => {
    const updated = await getUserBookings();
    setBookings(updated);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };


  // ===================================================================
  // LOADING SCREEN CLEAN
  // ===================================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-black rounded-full"></div>
      </div>
    );
  }


  // ===================================================================
  // MAIN PAGE UI (Clean White — Matches Profile)
  // ===================================================================

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-800" /> My Bookings
              </h1>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* BOOKINGS TABLE */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="py-20 text-center text-gray-600">No bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-800">Package</th>
                      <th className="px-6 py-4 text-left font-medium text-gray-800">Date</th>
                      <th className="px-6 py-4 text-left font-medium text-gray-800">Guests</th>
                      <th className="px-6 py-4 text-left font-medium text-gray-800">Amount</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-800">Status</th>
                      <th className="px-6 py-4 text-center font-medium text-gray-800">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map((booking) => {
                      const status = getBookingStatus(booking);

                      return (
                        <tr key={booking._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{booking.selectedPackage?.packageName}</td>

                          <td className="px-6 py-4">
                            {new Date(booking.selectedDate).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4">
                            {booking.adults?.length} Adults, {booking.children?.length} Children
                          </td>

                          <td className="px-6 py-4 font-medium">
                            ₹{booking.totalAmount?.toLocaleString("en-IN")}
                          </td>

                          <td className="px-6 py-4 text-center">{getStatusBadge(status)}</td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">

                              {/* VIEW DETAILS */}
                              <Button
                                variant="outline"
                                className="p-2"
                                onClick={() => handleViewDetails(booking)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              {/* CANCEL */}
                              {status === "upcoming" && (
                                <Button
                                  onClick={() => openCancelModal(booking._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Cancel
                                </Button>
                              )}

                              {/* RESCHEDULE */}
                              {status === "upcoming" && (
                                <Button
                                  onClick={() => openRescheduleModal(booking._id)}
                                  className="bg-black text-white hover:bg-gray-800"
                                >
                                  Reschedule
                                </Button>
                              )}

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


      {/* ================================================================
           FULL DETAILS POPUP — MATCHES PROFILE MODAL (Style A)
      ================================================================ */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            {/* CLEAN WHITE HEADER */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-800" /> Booking Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-8">

              {/* Status */}
              <div className="flex justify-between items-center">
                {getStatusBadge(getBookingStatus(selectedBooking))}

                <div className="text-right">
                  <p className="text-gray-500 text-sm">Booked On</p>
                  <p className="text-gray-800 font-semibold">
                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-gray-50 border rounded-xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-gray-700" /> Package Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Package Name</p>
                    <p className="font-medium">{selectedBooking.selectedPackage.packageName}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Destination</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedBooking.selectedPackage.destination}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedBooking.selectedPackage.duration} Days
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Travel Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedBooking.selectedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="bg-gray-50 border rounded-xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-gray-700" /> Guest Details
                </h3>

                <div className="space-y-6">

                  {/* Adults */}
                  {selectedBooking.adults?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Adults ({selectedBooking.adults.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedBooking.adults.map((a: any, i: number) => (
                          <div key={i} className="bg-white border rounded-lg p-4 shadow-sm">
                            <p className="font-medium">{a.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Children */}
                  {selectedBooking.children?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Children ({selectedBooking.children.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedBooking.children.map((c: any, i: number) => (
                          <div key={i} className="bg-white border rounded-lg p-4 shadow-sm">
                            <p className="font-medium">{c.name}</p>
                            <p className="text-gray-500 text-sm">Age: {c.age}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              {selectedBooking.contactInfo && (
                <div className="bg-gray-50 border rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-600" /> {selectedBooking.contactInfo.mobile}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-600" /> {selectedBooking.contactInfo.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-gray-50 border rounded-xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" /> Payment Details
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500">Total Paid</p>
                    <p className="text-xl font-semibold">
                      ₹{selectedBooking.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p className="text-gray-500">Payment ID</p>
                    <p className="bg-white border rounded px-3 py-2 font-mono">
                      {selectedBooking.payment_id || "N/A"}
                    </p>

                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold">{selectedBooking.paymentStatus}</p>

                    <p className="text-gray-500">Method</p>
                    <p className="font-semibold">{selectedBooking.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* CANCEL MODAL */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Cancel Booking"
        onConfirm={confirmCancel}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* RESCHEDULE MODAL */}
      <RescheduleModal
        open={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        bookingId={bookingToReschedule || ""}
        onSuccess={handleRescheduleSuccess}
      />
    </>
  );
};

export default BookingDetailsSection;
