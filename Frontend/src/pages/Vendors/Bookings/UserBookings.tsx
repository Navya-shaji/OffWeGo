import { useState, useEffect, useRef, type ElementType } from "react";
import {
  Search,
  Calendar,
  User,
  MapPin,
  Package,
  Eye,
  RefreshCw,
  Users,
  Plane,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  TrendingUp,
  Filter,
  DollarSign
} from "lucide-react";
import { getAllUserBookings } from "@/services/Booking/bookingService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

const ITEMS_PER_PAGE = 10;

export default function AllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
  }, [searchQuery, bookings, statusFilter]);

  const loadBookings = async () => {
    if (!vendorId) return;

    setIsLoading(true);
    try {
      const data = await getAllUserBookings(vendorId);
      // Ensure we have an array
      const bookingsData = Array.isArray(data) ? data : [];
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setDisplayCount(ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (statusFilter !== "all") {
      filtered = filtered.filter(b => {
        const status = b.bookingStatus || b.status || "upcoming";
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.userId?.name?.toLowerCase().includes(query) ||
          booking.userId?.email?.toLowerCase().includes(query) ||
          booking.selectedPackage?.packageName?.toLowerCase().includes(query) ||
          booking.packageId?.packageName?.toLowerCase().includes(query) ||
          booking.bookingId?.toLowerCase().includes(query) ||
          booking._id.toLowerCase().includes(query)
      );
    }

    setDisplayCount(ITEMS_PER_PAGE);
    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: ElementType; border: string }> = {
      pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
      confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle },
      upcoming: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Calendar },
      ongoing: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: Plane },
      completed: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", icon: CheckCircle },
      cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
    };

    const normalizedStatus = status?.toLowerCase() || "pending";
    const badge = badges[normalizedStatus] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} border ${badge.border} transition-all duration-300 hover:scale-105`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const badges: Record<string, { bg: string; text: string; border: string }> = {
      pending: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
      succeeded: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      failed: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
      refunded: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    };

    const normalizedStatus = paymentStatus?.toLowerCase() || "pending";
    const badge = badges[normalizedStatus] || badges.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${normalizedStatus === 'succeeded' ? 'bg-emerald-500' : normalizedStatus === 'failed' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
        <span className="capitalize">{paymentStatus}</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
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
    }, { threshold: 0.5 });

    observer.observe(target);

    return () => observer.disconnect();
  }, [filteredBookings.length]);

  const visibleBookings = filteredBookings.slice(0, displayCount);
  const canLoadMore = displayCount < filteredBookings.length;

  const totalRevenue = bookings.reduce((sum, b) => {
    // Only count if confirmed/completed and payment succeeded
    if (b.paymentStatus === 'succeeded' && b.bookingStatus !== 'cancelled') {
      return sum + (b.totalAmount || 0);
    }
    return sum;
  }, 0);

  const renderBookingDetailsModal = () => {
    if (!showDetailsModal || !selectedBooking) return null;

    const bookingDetails = selectedBooking;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white text-left shadow-2xl ring-1 ring-black/5 flex flex-col"
          >
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-indigo-600 px-6 py-6 sm:px-10 shrink-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 opacity-90"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Booking Details</h3>
                  <div className="mt-2 flex items-center bg-white/10 w-fit px-3 py-1 rounded-full text-indigo-100 text-sm font-medium border border-white/20">
                    <span className="uppercase tracking-wider mr-2 text-xs opacity-75">Order ID</span>
                    <span className="font-mono">{bookingDetails.bookingId || bookingDetails._id}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none transition-colors"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/50">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                {/* Left Column */}
                <div className="space-y-8">
                  {/* Customer Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                      <User className="h-4 w-4" /> Customer Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {(bookingDetails.userId?.name || bookingDetails.adults?.[0]?.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-lg">{bookingDetails.userId?.name || bookingDetails.adults?.[0]?.name || "N/A"}</p>
                          <p className="text-slate-500 text-sm">{bookingDetails.userId?.email || bookingDetails.contactInfo?.email}</p>
                          <p className="text-slate-500 text-sm">{bookingDetails.contactInfo?.mobile}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-slate-400 uppercase">City</span>
                          <p className="text-slate-700 font-medium">{bookingDetails.contactInfo?.city || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 uppercase">Address</span>
                          <p className="text-slate-700 font-medium truncate" title={bookingDetails.contactInfo?.address}>{bookingDetails.contactInfo?.address || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                      <Users className="h-4 w-4" /> Travelers
                    </h4>

                    {bookingDetails.adults?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Adults</p>
                        <div className="space-y-2">
                          {bookingDetails.adults.map((adult, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                              <span className="font-medium text-slate-700">{adult.name}</span>
                              <div className="flex items-center gap-3 text-slate-500 text-xs">
                                <span>{adult.age} yrs</span>
                                <span className="capitalize px-1.5 py-0.5 bg-white rounded border border-slate-200">{adult.gender}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bookingDetails.children?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Children</p>
                        <div className="space-y-2">
                          {bookingDetails.children.map((child, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                              <span className="font-medium text-slate-700">{child.name}</span>
                              <div className="flex items-center gap-3 text-slate-500 text-xs">
                                <span>{child.age} yrs</span>
                                <span className="capitalize px-1.5 py-0.5 bg-white rounded border border-slate-200">{child.gender}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Package & Payment */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                      <Package className="h-4 w-4" /> Package Details
                    </h4>

                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-indigo-900 text-lg">{bookingDetails.selectedPackage?.packageName || bookingDetails.packageId?.packageName || "Package Name"}</h5>
                        {bookingDetails.selectedPackage?.price && (
                          <span className="bg-white text-indigo-700 font-bold px-3 py-1 rounded-lg shadow-sm text-sm border border-indigo-100">
                            {formatCurrency(bookingDetails.selectedPackage.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-indigo-800/70">
                        {bookingDetails.selectedPackage?.destination && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {bookingDetails.selectedPackage.destination}</span>
                        )}
                        {bookingDetails.selectedPackage?.duration && (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bookingDetails.selectedPackage.duration} Days</span>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(bookingDetails.selectedDate)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-600">Booking Status</span>
                        {getStatusBadge(bookingDetails.bookingStatus || bookingDetails.status || "upcoming")}
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-600">Payment Status</span>
                        {getPaymentBadge(bookingDetails.paymentStatus)}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 font-medium">Total Paid Amount</span>
                        <span className="text-3xl font-bold text-slate-800 tracking-tight">{formatCurrency(bookingDetails.totalAmount)}</span>
                      </div>
                      {bookingDetails.payment_id && (
                        <p className="text-right text-xs text-slate-400 mt-2 font-mono">TxID: {bookingDetails.payment_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Flight Details (Conditional) */}
                  {bookingDetails.flightDetails && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                        <Plane className="h-4 w-4" /> Flight Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs text-slate-400">Airline</p>
                          <p className="font-semibold text-slate-800">{bookingDetails.flightDetails.airline}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs text-slate-400">Class</p>
                          <p className="font-semibold text-slate-800 capitalize">{bookingDetails.flightDetails.class}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <div className="text-xs text-slate-400">
                Created at {new Date(bookingDetails.createdAt).toLocaleString()}
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition shadow-sm">
                Close
              </button>
            </div>

          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <span className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
                <Package className="h-6 w-6" />
              </span>
              Booking Management
            </h1>
            <p className="mt-2 text-slate-500">
              Manage all user bookings, track payments, and view detailed metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadBookings}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Sync Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Bookings</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{bookings.length}</span>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">All time</span>
                </div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Bookings</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {bookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'ongoing').length}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
                </div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Actions</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {bookings.filter(b => b.bookingStatus === 'pending' || b.paymentStatus === 'pending').length}
                  </span>
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Action Req</span>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 shadow-lg shadow-indigo-200 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-100">Total Revenue</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
              <div className="rounded-xl bg-white/20 p-3 text-white backdrop-blur-sm">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-indigo-100 opacity-80">
              <TrendingUp className="h-3 w-3" />
              <span>Verified payments only</span>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search customers, booking IDs, packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none cursor-pointer rounded-xl bg-white pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-sm font-semibold text-slate-700">Fetching latest bookings...</p>
              <p className="text-xs text-slate-400">Please wait while we sync with the server.</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-slate-50/30">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Package className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No bookings found</h3>
              <p className="text-sm text-slate-500 max-w-sm text-center mt-1">
                We couldn't find any bookings matching your current filters. Try adjusting your search or filters.
              </p>
              {statusFilter !== "all" || searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(""); setStatusFilter("all") }}
                  className="mt-6 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Booking ID / Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Package</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Payment</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {visibleBookings.map((booking) => {
                    const displayBookingId = booking.bookingId || booking._id;
                    const truncatedId = displayBookingId.length > 15 ? displayBookingId.substring(0, 15) + '...' : displayBookingId;

                    return (
                      <tr
                        key={booking._id}
                        className="group hover:bg-indigo-50/30 transition-colors duration-200 cursor-default"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded w-fit" title={displayBookingId}>
                              {truncatedId}
                            </span>
                            <span className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(booking.createdAt)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold border border-indigo-200">
                              {(booking.userId?.name || booking.adults?.[0]?.name || "U")[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900">{booking.userId?.name || booking.adults?.[0]?.name || "Unknown"}</span>
                              <span className="text-xs text-slate-500">{booking.contactInfo?.email || "No email"}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="max-w-[200px]">
                            <p className="text-sm font-medium text-slate-900 truncate" title={booking.selectedPackage?.packageName}>
                              {booking.selectedPackage?.packageName || "Package unavailable"}
                            </p>
                            {booking.selectedPackage?.destination && (
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {booking.selectedPackage.destination}
                              </p>
                            )}
                            <p className="text-xs font-semibold text-indigo-600 mt-1 block">
                              {formatCurrency(booking.totalAmount)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.bookingStatus || booking.status || "upcoming")}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentBadge(booking.paymentStatus)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {canLoadMore && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center p-6 border-t border-slate-200 bg-slate-50/50"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="ml-1 font-medium">Loading more bookings...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {renderBookingDetailsModal()}
    </div>
  );
}
