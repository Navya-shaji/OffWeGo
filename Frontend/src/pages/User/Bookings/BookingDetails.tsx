import { generateBookingId } from "@/lib/generateBookingId";
import { 
  X, 
  Calendar, 
  MapPin, 
  Package, 
  Users, 
  Mail, 
  Phone, 
  Home, 
  CreditCard, 
  Tag, 
  Info,
  CheckCircle,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingDetailsModalProps {
  booking: any;
  onClose: () => void;
}

const BookingDetailsModal = ({ booking, onClose }: BookingDetailsModalProps) => {
  const packageData = booking.package || booking.selectedPackage;
  const displayBookingId = booking.bookingId || generateBookingId();
  const bookingStatus = booking.bookingStatus || booking.status || "upcoming";
  const paymentStatus = booking.paymentStatus || (booking.payment_id ? "succeeded" : "pending");

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const config: any = {
      upcoming: { 
        bg: "bg-blue-100", 
        text: "text-blue-700",
        label: "Upcoming" 
      },
      ongoing: { 
        bg: "bg-green-100", 
        text: "text-green-700",
        label: "Ongoing" 
      },
      completed: { 
        bg: "bg-gray-100", 
        text: "text-gray-700",
        label: "Completed" 
      },
      cancelled: { 
        bg: "bg-red-100", 
        text: "text-red-700",
        label: "Cancelled" 
      },
    };
    const c = config[statusLower] || config.upcoming;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${c.bg} ${c.text} font-semibold text-xs`}>
        <CheckCircle className="w-3.5 h-3.5" /> {c.label}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const config: any = {
      succeeded: { 
        bg: "bg-emerald-100", 
        text: "text-emerald-700",
        label: "Paid" 
      },
      pending: { 
        bg: "bg-amber-100", 
        text: "text-amber-700",
        label: "Pending" 
      },
      failed: { 
        bg: "bg-red-100", 
        text: "text-red-700",
        label: "Failed" 
      },
    };
    const c = config[statusLower] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${c.bg} ${c.text} font-semibold text-xs`}>
        <CreditCard className="w-3.5 h-3.5" /> {c.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-4 duration-500">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Booking Details</h2>
              <p className="text-white/80 text-xs font-mono">#{displayBookingId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1.5 rounded-lg transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4 bg-gray-50">
          {/* Quick Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-gray-600">Travel Date</p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {new Date(booking.selectedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-gray-600">Guests</p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {(booking.adults?.length || 0) + (booking.children?.length || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-rose-600" />
                <p className="text-xs font-semibold text-gray-600">Status</p>
              </div>
              <div className="flex gap-1.5">
                {getStatusBadge(bookingStatus)}
                {getPaymentBadge(paymentStatus)}
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-gray-800 text-sm">Guest Details</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {booking.adults && booking.adults.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Adults ({booking.adults.length})</h4>
                  <div className="space-y-2">
                    {booking.adults.map((adult: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800">{adult.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{adult.gender || "N/A"} • Age {adult.age || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.children && booking.children.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Children ({booking.children.length})</h4>
                  <div className="space-y-2">
                    {booking.children.map((child: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-800">{child.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{child.gender || "N/A"} • Age {child.age || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm">Contact Information</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Phone</p>
                    <p className="text-sm font-bold text-gray-800">{booking.contactInfo?.mobile || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Email</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{booking.contactInfo?.email || "N/A"}</p>
                  </div>
                </div>
                {booking.contactInfo?.city && (
                  <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600">City</p>
                      <p className="text-sm font-bold text-gray-800">{booking.contactInfo.city}</p>
                    </div>
                  </div>
                )}
                {booking.contactInfo?.address && (
                  <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg col-span-2">
                    <Home className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-600">Address</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{booking.contactInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-white" />
                <h3 className="font-bold text-white text-sm">Payment Details</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total Amount Paid</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(booking.totalAmount || 0)}
                </span>
              </div>
              {booking.payment_id && (
                <div className="pt-3 border-t border-emerald-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Payment ID</span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-emerald-200">
                    <p className="text-xs font-mono text-gray-800 break-all">{booking.payment_id}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-gray-600">Status</span>
                {getPaymentBadge(paymentStatus)}
              </div>
            </div>
          </div>

          {/* Package Info - Compact */}
          {packageData && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-gray-800 text-sm">Package Information</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-bold text-sm text-gray-800 mb-1">{packageData.packageName || "N/A"}</p>
                  {packageData.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{packageData.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {packageData.duration && (
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <p className="text-xs text-gray-600 mb-0.5">Duration</p>
                      <p className="text-sm font-bold text-gray-800">{packageData.duration} Days</p>
                    </div>
                  )}
                  {packageData.price && (
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <p className="text-xs text-gray-600 mb-0.5">Price</p>
                      <p className="text-sm font-bold text-gray-800">{formatCurrency(packageData.price)}</p>
                    </div>
                  )}
                  {packageData.flightOption && (
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <p className="text-xs text-gray-600 mb-0.5">Flight</p>
                      <p className="text-sm font-bold text-gray-800">Included</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Timestamp */}
          {booking.createdAt && (
            <div className="text-center text-xs text-gray-500 py-2">
              Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 py-2 text-sm font-semibold rounded-lg border-2 hover:bg-gray-100 transition-all"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
