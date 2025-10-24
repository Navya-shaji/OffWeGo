import { useState, useEffect } from "react";
import {
  Calendar,
  Package,
  Home,
  ArrowUpDown,
  Star,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { getUserBookings } from "@/services/Booking/bookingService";

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
          setBookings(data || []);
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

  const getBookingStatus = (booking: any) => {
    const bookingDate = new Date(booking.selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    const duration = booking.selectedPackage?.duration || 0;
    const endDate = new Date(bookingDate);
    endDate.setDate(endDate.getDate() + duration);
    endDate.setHours(23, 59, 59, 999);

    if (endDate < today) return "completed";
    if (bookingDate > today) return "upcoming";
    return "ongoing";
  };

  const canAddReview = (booking: any) => {
    return getBookingStatus(booking) === "completed";
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

  const handleAddReview = (booking: any) => {
    // Navigate to review section or open review modal
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    // You can also use navigate('/reviews') or trigger a review modal
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
      <div className="min-h-screen bg-gradient-to-br p-6">
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
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {sortedBookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-6">
                  <Calendar className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {filterStatus === "all"
                    ? "No Bookings Yet"
                    : `No ${
                        filterStatus.charAt(0).toUpperCase() +
                        filterStatus.slice(1)
                      } Trips`}
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  {filterStatus === "all"
                    ? "Start planning your next adventure!"
                    : "Try a different filter"}
                </p>
                {filterStatus === "all" && (
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                  >
                    Explore Packages
                  </button>
                )}
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
                      <th className="px-6 py-4 text-left font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBookings.map((booking, index) => {
                      const status = getBookingStatus(booking);
                      const statusColors = {
                        completed:
                          "bg-green-100 text-green-700 border-green-200",
                        upcoming: "bg-blue-100 text-blue-700 border-blue-200",
                        ongoing: "bg-amber-100 text-amber-700 border-amber-200",
                      };

                      return (
                        <tr
                          key={booking._id}
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-purple-50 transition-colors border-b border-gray-200`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">
                              {booking.selectedPackage?.packageName || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {new Date(booking.selectedDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
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
                          <td className="px-6 py-4">
                            <span className="text-lg font-bold text-gray-900">
                              ₹
                              {(booking.totalAmount || 0).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm font-medium flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                View
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

      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Booking Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Package Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedBooking.selectedPackage?.packageName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedBooking.selectedDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹
                    {(selectedBooking.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Guests</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedBooking.adults?.length || 0} Adults,{" "}
                    {selectedBooking.children?.length || 0} Children
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      getBookingStatus(selectedBooking) === "completed"
                        ? "bg-green-100 text-green-700"
                        : getBookingStatus(selectedBooking) === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {getBookingStatus(selectedBooking).charAt(0).toUpperCase() +
                      getBookingStatus(selectedBooking).slice(1)}
                  </span>
                </div>
              </div>

              {canAddReview(selectedBooking) && (
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleAddReview(selectedBooking);
                    navigate("/create-review");
                  }}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Add Review for This Trip
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDetailsSection;
