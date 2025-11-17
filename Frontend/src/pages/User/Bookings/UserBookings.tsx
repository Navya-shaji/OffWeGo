import { useState, useEffect } from "react";
import {
  Calendar,
  Package,
  Home,
  ArrowUpDown,
  Star,
  X,
  Eye,
  MapPin,
  Users,
  Clock,
  DollarSign,
  CreditCard,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import {
  cancelBooking,
  getUserBookings,
} from "@/services/Booking/bookingService";

const BookingDetailsSection = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "selectedDate",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          const data = await getUserBookings(user.id);
          const sortedData = data.sort(
            (a: any, b: any) =>
              new Date(b.selectedDate).getTime() -
              new Date(a.selectedDate).getTime()
          );
          setBookings(sortedData || []);
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setBookings([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?.id]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setLoading(true);
      const response = await cancelBooking(bookingId);
      alert(response.message || "Booking cancelled and refund added to wallet.");
      const updatedBookings = await getUserBookings(user.id);
      setBookings(updatedBookings);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Something went wrong while cancelling the booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    navigate("/review"); 
  };

  const getBookingStatus = (booking: any) => {
    const bookingDate = new Date(booking.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    const duration = booking.selectedPackage?.duration || 0;
    const endDate = new Date(bookingDate);
    endDate.setDate(endDate.getDate() + duration);
    endDate.setHours(23, 59, 59, 999);

    if (booking.bookingStatus?.toLowerCase() === "cancelled") return "cancelled";
    if (endDate < today) return "completed";
    if (bookingDate > today) return "upcoming";
    return "ongoing";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
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
        bg: "bg-gray-100",
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

    const config = statusConfig[status] || statusConfig.upcoming;

    return (
      <span
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.text} font-semibold`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const sortBookings = (bookingsToSort: any[]) => {
    const sorted = [...bookingsToSort].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "selectedDate":
          aValue = new Date(a.selectedDate).getTime();
          bValue = new Date(b.selectedDate).getTime();
          break;
        case "totalAmount":
          aValue = a.totalAmount || 0;
          bValue = b.totalAmount || 0;
          break;
        case "packageName":
          aValue = (a.selectedPackage?.packageName || "").toLowerCase();
          bValue = (b.selectedPackage?.packageName || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return sorted;
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => getBookingStatus(b) === filterStatus);

  const sortedBookings = sortBookings(filteredBookings);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </button>
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-purple-600" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    My Bookings
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">
                  Filter:
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Trips</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {sortedBookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-6">
                  <Calendar className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  No Bookings Found
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Start planning your next adventure!
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Explore Packages
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("packageName")}
                          className="flex items-center gap-2 hover:text-purple-200 transition-colors font-semibold"
                        >
                          Package
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("selectedDate")}
                          className="flex items-center gap-2 hover:text-purple-200 transition-colors font-semibold"
                        >
                          Date
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Guests
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort("totalAmount")}
                          className="flex items-center gap-2 hover:text-purple-200 transition-colors font-semibold"
                        >
                          Amount
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBookings.map((booking, index) => (
                      <tr
                        key={booking._id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-purple-50 transition-colors border-b border-gray-200`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {booking.selectedPackage?.packageName || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(booking.selectedDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                              {booking.adults?.length || 0}A
                            </span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                              {booking.children?.length || 0}C
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-lg font-bold text-gray-900">
                          ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(getBookingStatus(booking))}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {getBookingStatus(booking) === "upcoming" && (
                              <button
                                onClick={() =>
                                  handleCancelBooking(booking.bookingId)
                                }
                                className="p-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-sm hover:shadow-md"
                                title="Cancel Booking"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}

                            {getBookingStatus(booking) === "completed" && (
                              <button
                                onClick={handleWriteReview}
                                className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                                title="Write Review"
                              >
                                <Star className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Package className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-purple-100 text-sm">
                    Booking ID: {selectedBooking.bookingId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                {getStatusBadge(getBookingStatus(selectedBooking))}
                <div className="text-right">
                  <p className="text-sm text-gray-500">Booked on</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedBooking.createdAt || selectedBooking.selectedDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-purple-600" />
                  Package Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Package Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedBooking.selectedPackage?.packageName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      {selectedBooking.selectedPackage?.duration || 0} Days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Destination</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      {selectedBooking.selectedPackage?.destination || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Travel Date</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      {new Date(selectedBooking.selectedDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Guest Information
                </h3>
                
                {/* Adults */}
                {selectedBooking.adults && selectedBooking.adults.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Adults ({selectedBooking.adults.length})
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedBooking.adults.map((adult: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="font-semibold text-gray-900 mb-2">
                            {adult.name || `Adult ${idx + 1}`}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-600 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {adult.phone || "N/A"}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {adult.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Children */}
                {selectedBooking.children && selectedBooking.children.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Children ({selectedBooking.children.length})
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedBooking.children.map((child: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="font-semibold text-gray-900 mb-1">
                            {child.name || `Child ${idx + 1}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Age: {child.age || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  Payment Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{(selectedBooking.totalAmount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                    <p className="text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {selectedBooking.payment_id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <p className="font-semibold text-gray-900">
                      {selectedBooking.paymentStatus || "Completed"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900">
                      {selectedBooking.paymentMethod || "Online"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                {getBookingStatus(selectedBooking) === "upcoming" && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.bookingId)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel Booking
                  </button>
                )}
                {getBookingStatus(selectedBooking) === "completed" && (
                  <button
                    onClick={handleWriteReview}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDetailsSection;