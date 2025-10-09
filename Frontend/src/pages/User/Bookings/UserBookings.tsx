import { useState, useEffect } from "react";
import { Calendar} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getUserBookings } from "@/services/Booking/bookingService";
import BookingDetailsModal from "./BookingSetails";

const BookingDetailsSection = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          const data = await getUserBookings(user.id);
          setBookings(data);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user?.id]);

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }
  console.log(bookings,"bookin")

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white border border-gray-900 p-6">
          <h1 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-gray-900">
            My Bookings
          </h1>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Bookings Yet
              </h2>
              <p className="text-gray-600">Start planning your next trip!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-900">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="border border-gray-900 px-4 py-3 text-left font-semibold">
                      Destination
                    </th>
                    <th className="border border-gray-900 px-4 py-3 text-left font-semibold">
                      Package Name
                    </th>
                    <th className="border border-gray-900 px-4 py-3 text-left font-semibold">
                      Date
                    </th>
                    <th className="border border-gray-900 px-4 py-3 text-left font-semibold">
                      Guests
                    </th>
                    <th className="border border-gray-900 px-4 py-3 text-left font-semibold">
                      Amount
                    </th>
                    <th className="border border-gray-900 px-4 py-3 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-gray-200 transition`}
                    >
                      <td className="border border-gray-900 px-4 py-3 text-sm">
                        {booking.destination?.name || "N/A"}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm">
                        {booking.package?.name || "N/A"}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm">
                        {new Date(booking.selectedDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm">
                        {booking.adults.length}A / {booking.children.length}C
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm font-bold">
                        ₹{booking.totalAmount}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-center">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="px-3 py-1 bg-black text-white text-xs font-semibold hover:bg-gray-800 transition"
                        >
                          VIEW
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default BookingDetailsSection;