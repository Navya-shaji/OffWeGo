import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  User,
  MapPin,
  Package,
  CreditCard,
  Eye,
  RefreshCw,
  Users,
  Baby,
  Plane,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { getAllUserBookings } from "@/services/Booking/bookingService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";

interface Traveler {
  name: string;
  age: number;
  gender: string;
}

interface ContactInfo {
  email: string;
  mobile: string;
  city: string;
  address: string;
}

interface Booking {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  packageId: {
    _id: string;
    packageName: string;
    price: number;
    destination?: string;
    destinationId?: string;
  };
  selectedDate: string;
  adults: Traveler[];
  children: Traveler[];
  contactInfo: ContactInfo;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "succeeded" | "failed" | "refunded";
  flightDetails?: {
    airline: string;
    class: string;
    price: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const vendorId = useSelector(
    (state: RootState) => state.vendorAuth.vendor?.id
  );

  useEffect(() => {
    if (vendorId) {
      loadBookings();
    }
  }, [vendorId]);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, bookings]);

  const loadBookings = async () => {
    if (!vendorId) return;

    setIsLoading(true);
    try {
      const data = await getAllUserBookings(vendorId);
      console.log(data, "data");
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.userId?.name?.toLowerCase().includes(query) ||
          booking.userId?.email?.toLowerCase().includes(query) ||
          booking.packageId?.packageName?.toLowerCase().includes(query) ||
          booking._id.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  };
  console.log(filteredBookings, "filtered");
  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      confirmed: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
      },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: CheckCircle,
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const badges = {
      pending: { bg: "bg-gray-100", text: "text-gray-700" },
      succeeded: { bg: "bg-emerald-100", text: "text-emerald-700" },
      failed: { bg: "bg-red-100", text: "text-red-700" },
      refunded: { bg: "bg-purple-100", text: "text-purple-700" },
    };
    const badge =
      badges[paymentStatus as keyof typeof badges] || badges.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        <CreditCard className="w-3 h-3" />
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };
  console.log(bookings, "book");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-600" />
                All Bookings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all customer bookings
              </p>
            </div>
            <button
              onClick={loadBookings}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      bookings.filter((b) => b.paymentStatus === "succeeded")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      bookings.filter((b) => b.paymentStatus === "pending")
                        .length
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                    )}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, package..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Travel Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Travelers
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">
                          {booking._id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {booking.adults?.[0]?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.contactInfo?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.selectedPackage?.packageName || "N/A"}
                        </div>
                        {booking.packageId?.destination && (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {booking.packageId.destination}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(booking.selectedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {booking.adults?.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              <Users className="w-3 h-3" />
                              {booking.adults.length}
                            </span>
                          )}
                          {booking.children?.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded">
                              <Baby className="w-3 h-3" />
                              {booking.children.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentBadge(booking.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-sm text-purple-100 mt-1">
                    ID: #{selectedBooking._id.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.userId?.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.userId?.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mobile:</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.contactInfo?.mobile}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">City:</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.contactInfo?.city}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.contactInfo?.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Package Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Package Name:</span>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.packageId?.packageName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Travel Date:</span>
                      <p className="font-medium text-gray-900">
                        {formatDate(selectedBooking.selectedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Travelers
                  </h3>

                  {selectedBooking.adults &&
                    selectedBooking.adults.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Adults
                        </h4>
                        <div className="space-y-2">
                          {selectedBooking.adults.map((adult, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 text-sm bg-white p-2 rounded"
                            >
                              <span className="font-medium">{adult.name}</span>
                              <span className="text-gray-600">
                                Age: {adult.age}
                              </span>
                              <span className="text-gray-600 capitalize">
                                {adult.gender}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedBooking.children &&
                    selectedBooking.children.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Children
                        </h4>
                        <div className="space-y-2">
                          {selectedBooking.children.map((child, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 text-sm bg-white p-2 rounded"
                            >
                              <span className="font-medium">{child.name}</span>
                              <span className="text-gray-600">
                                Age: {child.age}
                              </span>
                              <span className="text-gray-600 capitalize">
                                {child.gender}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Flight Details */}
                {selectedBooking.flightDetails && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Plane className="w-5 h-5 text-purple-600" />
                      Flight Details
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Airline:</span>
                        <p className="font-medium text-gray-900">
                          {selectedBooking.flightDetails.airline}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Class:</span>
                        <p className="font-medium text-gray-900 capitalize">
                          {selectedBooking.flightDetails.class}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(selectedBooking.flightDetails.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    Payment Summary
                  </h3>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Status:</span>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      {getPaymentBadge(selectedBooking.paymentStatus)}
                    </div>
                  </div>
                  <div className="border-t border-purple-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatCurrency(selectedBooking.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="text-xs text-gray-500 flex justify-between border-t pt-4">
                  <span>Created: {formatDate(selectedBooking.createdAt)}</span>
                  <span>Updated: {formatDate(selectedBooking.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
