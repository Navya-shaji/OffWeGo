import { useState, useEffect, useRef } from "react";
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
  bookingId?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  packageId?: {
    _id: string;
    packageName: string;
    price: number;
    destination?: string;
    destinationId?: string;
  };
  selectedPackage?: {
    _id: string;
    packageName: string;
    price: number;
    duration?: number;
    destination?: string;
    destinationId?: string;
  };
  selectedDate: string;
  adults: Traveler[];
  children: Traveler[];
  contactInfo: ContactInfo;
  totalAmount: number;
  bookingStatus?: "pending" | "confirmed" | "cancelled" | "completed" | "upcoming" | "ongoing";
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "succeeded" | "failed" | "refunded";
  payment_id?: string;
  flightDetails?: {
    airline: string;
    class: string;
    price: number;
  };
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 20;

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const vendorId = useSelector(
    (state: RootState) => state.vendorAuth.vendor?.id
  );

  useEffect(() => {
    if (vendorId) {
      loadBookings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  useEffect(() => {
    filterBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, bookings]);

  const loadBookings = async () => {
    if (!vendorId) return;

    setIsLoading(true);
    try {
      const data = await getAllUserBookings(vendorId);
      setBookings(data);
      setFilteredBookings(data);
      setDisplayCount(ITEMS_PER_PAGE);
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
          booking.selectedPackage?.packageName?.toLowerCase().includes(query) ||
          booking.packageId?.packageName?.toLowerCase().includes(query) ||
          booking.bookingId?.toLowerCase().includes(query) ||
          booking._id.toLowerCase().includes(query) ||
          booking.bookingId?.toLowerCase().includes(query)
      );
    }

    setDisplayCount(ITEMS_PER_PAGE);
    setFilteredBookings(filtered);
  };
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

  useEffect(() => {
    if (!filteredBookings.length) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        setDisplayCount((prev) => {
          if (prev >= filteredBookings.length) return prev;
          return Math.min(prev + ITEMS_PER_PAGE, filteredBookings.length);
        });
      }
    }, { threshold: 1 });

    observer.observe(target);

    return () => observer.disconnect();
  }, [filteredBookings.length]);

  useEffect(() => {
    setDisplayCount((prev) => {
      if (!filteredBookings.length) return ITEMS_PER_PAGE;
      return Math.min(Math.max(prev, ITEMS_PER_PAGE), filteredBookings.length);
    });
  }, [filteredBookings.length]);

  const visibleBookings = filteredBookings.slice(0, displayCount);
  const canLoadMore = displayCount < filteredBookings.length;

  const renderBookingDetailsModal = () => {
    if (!showDetailsModal || !selectedBooking) return null;

    const bookingDetails = selectedBooking;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <p className="text-sm text-purple-100 mt-1">ID: #{bookingDetails.bookingId || bookingDetails._id}</p>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close booking details"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Customer Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">{bookingDetails.userId?.name || bookingDetails.adults?.[0]?.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{bookingDetails.userId?.email || bookingDetails.contactInfo?.email || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Mobile:</span>
                  <p className="font-medium text-gray-900">{bookingDetails.contactInfo?.mobile || "N/A"}</p>
                </div>
                {bookingDetails.contactInfo?.city ? (
                  <div>
                    <span className="text-gray-600">City:</span>
                    <p className="font-medium text-gray-900">{bookingDetails.contactInfo.city}</p>
                  </div>
                ) : null}
                {bookingDetails.contactInfo?.address ? (
                  <div className="col-span-2">
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium text-gray-900">{bookingDetails.contactInfo.address}</p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Package Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Package Name:</span>
                  <p className="font-medium text-gray-900">{bookingDetails.selectedPackage?.packageName || bookingDetails.packageId?.packageName || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Travel Date:</span>
                  <p className="font-medium text-gray-900">{formatDate(bookingDetails.selectedDate)}</p>
                </div>
                {bookingDetails.selectedPackage?.duration ? (
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium text-gray-900">{bookingDetails.selectedPackage.duration} Days</p>
                  </div>
                ) : null}
                {bookingDetails.selectedPackage?.price ? (
                  <div>
                    <span className="text-gray-600">Package Price:</span>
                    <p className="font-medium text-gray-900">{formatCurrency(bookingDetails.selectedPackage.price)}</p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Travelers
              </h3>
              {bookingDetails.adults?.length ? (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Adults</h4>
                  <div className="space-y-2">
                    {bookingDetails.adults.map((adult, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm bg-white p-2 rounded">
                        <span className="font-medium">{adult.name}</span>
                        <span className="text-gray-600">Age: {adult.age}</span>
                        <span className="text-gray-600 capitalize">{adult.gender}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {bookingDetails.children?.length ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Children</h4>
                  <div className="space-y-2">
                    {bookingDetails.children.map((child, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm bg-white p-2 rounded">
                        <span className="font-medium">{child.name}</span>
                        <span className="text-gray-600">Age: {child.age}</span>
                        <span className="text-gray-600 capitalize">{child.gender}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {bookingDetails.flightDetails ? (
              <section className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-purple-600" />
                  Flight Details
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Airline:</span>
                    <p className="font-medium text-gray-900">{bookingDetails.flightDetails.airline}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Class:</span>
                    <p className="font-medium text-gray-900 capitalize">{bookingDetails.flightDetails.class}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <p className="font-medium text-gray-900">{formatCurrency(bookingDetails.flightDetails.price)}</p>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking Status:</span>
                  {getStatusBadge(bookingDetails.bookingStatus || bookingDetails.status || "upcoming")}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status:</span>
                  {getPaymentBadge(bookingDetails.paymentStatus || (bookingDetails.payment_id ? "succeeded" : "pending"))}
                </div>
                {bookingDetails.bookingId ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booking ID:</span>
                    <p className="font-medium text-gray-900 font-mono text-xs">#{bookingDetails.bookingId}</p>
                  </div>
                ) : null}
                {bookingDetails.payment_id ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment ID:</span>
                    <p className="font-medium text-gray-900 font-mono text-xs break-all">{bookingDetails.payment_id}</p>
                  </div>
                ) : null}
              </div>
              {(() => {
                const isCancelled =
                  bookingDetails.bookingStatus?.toLowerCase() === "cancelled" ||
                  bookingDetails.status?.toLowerCase() === "cancelled";

                if (isCancelled) {
                  return (
                    <div className="border-t border-red-200 pt-3 mt-3">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700 font-semibold">
                          This booking has been cancelled. Amount information is not available.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="border-t border-purple-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatCurrency(bookingDetails.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </section>

            <div className="text-xs text-gray-500 flex justify-between border-t pt-4">
              <span>Created: {formatDate(bookingDetails.createdAt)}</span>
              <span>Updated: {formatDate(bookingDetails.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Vendor Operations</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <Package className="h-6 w-6 text-indigo-600" />
              All Bookings
            </h1>
          </div>
          <button
            onClick={loadBookings}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-500 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total bookings</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold text-slate-900">{bookings.length}</span>
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Confirmed</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold text-slate-900">
                {bookings.filter((b) => b.paymentStatus === "succeeded").length}
              </span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Awaiting payment</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold text-slate-900">
                {bookings.filter((b) => b.paymentStatus === "pending").length}
              </span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total revenue</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-semibold text-slate-900">
                {formatCurrency(bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0))}
              </span>
              <CreditCard className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, email, package or booking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Loading bookings…</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
              <Package className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or refreshing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Travel Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Travellers</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {visibleBookings.map((booking) => {
                    const displayBookingId = booking.bookingId || booking._id;
                    return (
                      <tr key={booking._id} className="bg-white hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-xs text-slate-700">{displayBookingId}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{booking.adults?.[0]?.name || "N/A"}</p>
                              <p className="text-xs text-slate-500">{booking.contactInfo?.email || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{booking.selectedPackage?.packageName || "N/A"}</p>
                          {booking.packageId?.destination ? (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              {booking.packageId.destination}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {formatDate(booking.selectedDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {booking.adults?.length ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                <Users className="h-3 w-3" />
                                {booking.adults.length}
                              </span>
                            ) : null}
                            {booking.children?.length ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
                                <Baby className="h-3 w-3" />
                                {booking.children.length}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.bookingStatus || booking.status || "upcoming")}
                        </td>
                        <td className="px-6 py-4">
                          {getPaymentBadge(booking.paymentStatus)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="inline-flex items-center gap-2 rounded-lg border border-indigo-500 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          >
                            <Eye className="h-4 w-4" />
                            View
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

        <div
          ref={canLoadMore ? loadMoreRef : null}
          className="flex h-12 items-center justify-center text-xs text-slate-500"
        >
          {canLoadMore ? "Loading more bookings…" : null}
        </div>
      </div>

      {renderBookingDetailsModal()}
    </div>
  );
}
