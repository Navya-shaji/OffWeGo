import { generateBookingId } from "@/lib/generateBookingId";
import { X, Calendar, MapPin, Package, Users, Mail, Phone, Home, CreditCard, Clock,  Tag, Info } from "lucide-react";

interface BookingDetailsModalProps {
  booking: any;
  onClose: () => void;
}

const BookingDetailsModal = ({ booking, onClose }: BookingDetailsModalProps) => {
  const packageData = booking.package || booking.selectedPackage;
  const destinationData = booking.destination || packageData?.destination;
  const displayBookingId = booking.bookingId || generateBookingId();

console.log("detals",packageData)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white border-4 border-black max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold">Complete Booking Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-800 p-2 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Summary */}
          <section className="border-4 border-gray-900 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">BOOKING SUMMARY</h3>
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase">Booking ID</p>
                <p className="font-mono text-sm font-bold">#{displayBookingId}</p>

              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white border-2 border-gray-900 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase">Travel Date</p>
                </div>
                <p className="font-bold">{new Date(booking.selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="bg-white border-2 border-gray-900 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase">Total Guests</p>
                </div>
                <p className="font-bold">{booking.adults?.length || 0} Adults, {booking.children?.length || 0} Children</p>
              </div>
              <div className="bg-white border-2 border-gray-900 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase">Total Amount</p>
                </div>
                <p className="font-bold text-2xl">₹{booking.totalAmount}</p>
              </div>
              <div className="bg-white border-2 border-gray-900 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase">Payment Status</p>
                </div>
                <p className="font-bold">{booking.payment_id ? 'Paid' : 'Pending'}</p>
              </div>
            </div>
          </section>

          {/* Destination Details */}
          {destinationData && (
            <section className="border-2 border-gray-900 p-4">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                <MapPin className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase">Destination Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">{destinationData.name || "N/A"}</p>
                  {destinationData.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{destinationData.description}</p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {destinationData.location && (
                    <div className="bg-gray-50 border border-gray-900 p-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Location</p>
                      <p className="text-sm font-semibold">{destinationData.location}</p>
                    </div>
                  )}
                  {destinationData.category && (
                    <div className="bg-gray-50 border border-gray-900 p-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Category</p>
                      <p className="text-sm font-semibold">{destinationData.category}</p>
                    </div>
                  )}
                  {destinationData.bestTimeToVisit && (
                    <div className="bg-gray-50 border border-gray-900 p-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Best Time to Visit</p>
                      <p className="text-sm font-semibold">{destinationData.bestTimeToVisit}</p>
                    </div>
                  )}
                </div>

                {destinationData.activities && destinationData.activities.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Activities Available</p>
                    <div className="flex flex-wrap gap-2">
                      {destinationData.activities.map((activity: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-black text-white text-xs font-semibold">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {destinationData.images && destinationData.images.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Destination Images</p>
                    <div className="grid grid-cols-3 gap-2">
                      {destinationData.images.slice(0, 3).map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Destination ${index + 1}`}
                          className="w-full h-32 object-cover border-2 border-gray-900"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Package Details */}
          {packageData && (
            <section className="border-2 border-gray-900 p-4">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                <Package className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase">Package Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">{packageData.packageName || "N/A"}</p>
                  {packageData.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{packageData.description}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {packageData.duration && (
                    <div className="bg-gray-50 border border-gray-900 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        <p className="text-xs font-semibold text-gray-600 uppercase">Duration</p>
                      </div>
                      <p className="text-sm font-bold">{packageData.duration}</p>
                    </div>
                  )}
                  {packageData.price && (
                    <div className="bg-gray-50 border border-gray-900 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4" />
                        <p className="text-xs font-semibold text-gray-600 uppercase">Price per Person</p>
                      </div>
                      <p className="text-sm font-bold">₹{packageData.price}</p>
                    </div>
                  )}
                
                  {packageData.groupSize && (
                    <div className="bg-gray-50 border border-gray-900 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" />
                        <p className="text-xs font-semibold text-gray-600 uppercase">Group Size</p>
                      </div>
                      <p className="text-sm font-bold">{packageData.groupSize}</p>
                    </div>
                  )}
                </div>

                {packageData.inclusions && packageData.inclusions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Inclusions</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {packageData.inclusions.map((inclusion: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

            


              </div>
            </section>
          )}

          {/* Contact Information */}
          <section className="border-2 border-gray-900 p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
              <Info className="w-6 h-6" />
              <h3 className="text-lg font-bold uppercase">Contact Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                  <p className="text-sm">{booking.contactInfo?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                  <p className="text-sm">{booking.contactInfo?.mobile || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">City</p>
                  <p className="text-sm">{booking.contactInfo?.city || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Address</p>
                  <p className="text-sm">{booking.contactInfo?.address || "N/A"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Guest Details */}
          <section className="border-2 border-gray-900 p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
              <Users className="w-6 h-6" />
              <h3 className="text-lg font-bold uppercase">Guest Details</h3>
            </div>
            
            {booking.adults && booking.adults.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-sm mb-3 uppercase bg-black text-white px-3 py-2">Adults ({booking.adults.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-900">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">#</th>
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">Name</th>
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">Age</th>
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.adults.map((adult: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                          <td className="border border-gray-900 px-3 py-2 text-sm font-bold">{index + 1}</td>
                          <td className="border border-gray-900 px-3 py-2 text-sm">{adult.name || "N/A"}</td>
                          <td className="border border-gray-900 px-3 py-2 text-sm">{adult.age || "N/A"}</td>
                          <td className="border border-gray-900 px-3 py-2 text-sm">{adult.gender || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {booking.children && booking.children.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-3 uppercase bg-black text-white px-3 py-2">Children ({booking.children.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-900">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">#</th>
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">Name</th>
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">Age</th>
                        <th className="border border-gray-900 px-3 py-2 text-left text-xs font-semibold">Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.children.map((child: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                          <td className="border border-gray-900 px-3 py-2 text-sm font-bold">{index + 1}</td>
                          <td className="border border-gray-900 px-3 py-2 text-sm">{child.name || "N/A"}</td>
                          <td className="border border-gray-900 px-3 py-2 text-sm">{child.age || "N/A"}</td>
                          <td className="border border-gray-900 px-3 py-2 text-sm">{child.gender || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

        
          <div className="flex justify-end gap-3 pt-4 border-t-4 border-gray-900">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition text-sm uppercase"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;