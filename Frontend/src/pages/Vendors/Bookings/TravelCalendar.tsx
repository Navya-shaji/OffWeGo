import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Phone,
  IndianRupee,
  Users,
  Play,
  Square,
} from "lucide-react";
import {
  bookingdates,
  getAllUserBookings,
} from "@/services/Booking/bookingService";
import type { Booking } from "@/interface/Boooking";

export const TravelCalendar: React.FC<{ vendorId: string }> = ({
  vendorId,
}) => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
  const [bookingStatuses, setBookingStatuses] = useState<
    Record<string, "not-started" | "started" | "completed">
  >({});

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const data = await bookingdates(vendorId);
        setDates(data);
      } catch (err) {
        console.error("Error fetching booking dates:", err);
        setError("Failed to load booking dates.");
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, [vendorId]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const details = await getAllUserBookings(vendorId);
        setBookingDetails(details || []);
      } catch (err) {
        console.error("Error fetching booking details:", err);
      }
    };
    fetchAllBookings();
  }, [vendorId]);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  }, []);

  const todaysBookings = useMemo(() => {
    return bookingDetails.filter((booking) => {
      const bookingDate = new Date(booking.selectedDate);
      const bookingStr = `${bookingDate.getFullYear()}-${String(
        bookingDate.getMonth() + 1
      ).padStart(2, "0")}-${String(bookingDate.getDate()).padStart(2, "0")}`;
      return bookingStr === todayStr;
    });
  }, [bookingDetails, todayStr]);

  const bookedDatesSet = useMemo(() => {
    return new Set(
      dates.map((dateStr) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      })
    );
  }, [dates]);

  const stats = useMemo(() => {
    if (dates.length === 0)
      return { totalBookings: 0, upcomingMonths: 0, mostBookedMonth: "N/A" };

    const monthCounts: Record<string, number> = {};
    const uniqueMonths = new Set<string>();

    dates.forEach((dateStr) => {
      const dateObj = new Date(dateStr);
      const monthYear = `${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
      uniqueMonths.add(monthYear);
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });

    const mostBooked = Object.entries(monthCounts).reduce(
      (max, [month, count]) => (count > max.count ? { month, count } : max),
      { month: "N/A", count: 0 }
    );

    return {
      totalBookings: dates.length,
      upcomingMonths: uniqueMonths.size,
      mostBookedMonth: mostBooked.month,
    };
  }, [dates]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const isBooked = bookedDatesSet.has(dateStr);
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = new Date().toDateString() === date.toDateString();

      days.push({
        day,
        date: dateStr,
        isBooked,
        isWeekend,
        isToday,
      });
    }

    return days;
  }, [currentDate, bookedDatesSet]);

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = async (dateStr: string, isBooked: boolean) => {
    if (!isBooked) return;

    try {
      const details = await getAllUserBookings(vendorId);
      const filteredDetails = details.filter((booking: any) => {
        const bookingDate = new Date(booking.selectedDate);
        const bookingStr = `${bookingDate.getFullYear()}-${String(
          bookingDate.getMonth() + 1
        ).padStart(2, "0")}-${String(bookingDate.getDate()).padStart(2, "0")}`;
        return bookingStr === dateStr;
      });
      setBookingDetails(filteredDetails || []);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setBookingDetails([]);
    }
  };

  const handleStartBooking = (bookingId: string) => {
    setBookingStatuses((prev) => ({ ...prev, [bookingId]: "started" }));
  };

  const handleEndBooking = (bookingId: string) => {
    setBookingStatuses((prev) => ({ ...prev, [bookingId]: "completed" }));
  };

  const getBookingStatus = (bookingId: string) => {
    return bookingStatuses[bookingId] || "not-started";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-indigo-600 font-semibold">
            Loading booking calendar...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-xl text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4" style={{ overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto space-y-6" style={{ overflow: 'visible' }}>
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Booking Calendar
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your bookings and schedules
              </p>
            </div>
          </div>
        </div>

        {/* Today's Bookings Section */}
        {todaysBookings.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg p-8 border border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-md">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Today's Bookings
                </h2>
                <p className="text-slate-600 text-sm">
                  {todaysBookings.length} booking(s) scheduled for today
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {todaysBookings.map((booking: any) => {
                const status = getBookingStatus(booking._id || "");
                const isCancelled = booking.bookingStatus?.toLowerCase() === "cancelled" || booking.status?.toLowerCase() === "cancelled";
                return (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-800">
                            {booking.contactInfo?.name || booking.userId?.name || booking.adults?.[0]?.name || "Customer"}
                          </h3>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              status === "completed"
                                ? "bg-green-100 text-green-700"
                                : status === "started"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status === "completed"
                              ? "Completed"
                              : status === "started"
                              ? "In Progress"
                              : "Not Started"}
                          </span>
                        </div>
                        <p className="text-indigo-600 font-semibold text-lg mb-2">
                          {booking.selectedPackage?.packageName || booking.packageId?.packageName || "Package"}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{booking.contactInfo?.mobile || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>
                              {(booking.adults?.length || 0) + (booking.children?.length || 0)}{" "}
                              travelers
                            </span>
                          </div>
                          {!isCancelled && (
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4" />
                              <span className="font-semibold">
                                ₹{(booking.totalAmount || 0).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {status === "not-started" && !isCancelled && (
                          <button
                            onClick={() => handleStartBooking(booking._id || "")}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-semibold"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </button>
                        )}
                        {status === "started" && !isCancelled && (
                          <button
                            onClick={() => handleEndBooking(booking._id || "")}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-semibold"
                          >
                            <Square className="w-4 h-4" />
                            End
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium mb-2">
                  Total Bookings
                </p>
                <p className="text-5xl font-bold">{stats.totalBookings}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                <Calendar className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">
                  Upcoming Months
                </p>
                <p className="text-5xl font-bold">{stats.upcomingMonths}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                <Calendar className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium mb-2">
                  Most Booked
                </p>
                <p className="text-3xl font-bold">{stats.mostBookedMonth}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                <Star className="w-10 h-10 fill-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-800">{monthName}</h2>
            <div className="flex gap-3">
              <button
                onClick={goToPreviousMonth}
                className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
              <span className="text-slate-600 font-medium">
                Booked (Weekday)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg"></div>
              <span className="text-slate-600 font-medium">
                Booked (Weekend)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-3 border-blue-500 rounded-lg"></div>
              <span className="text-slate-600 font-medium">Today</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-bold text-slate-700 py-3 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((dayInfo, index) => {
              if (!dayInfo) {
                return (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                );
              }

              const { day, isBooked, isWeekend, isToday, date } = dayInfo;

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date, isBooked)}
                  className={`aspect-square flex items-center justify-center rounded-2xl relative transition-all ${
                    isBooked
                      ? isWeekend
                        ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
                      : "bg-slate-50 hover:bg-slate-100"
                  } ${isToday ? "ring-4 ring-blue-500 ring-offset-2" : ""}`}
                >
                  <span
                    className={`text-lg font-semibold ${
                      isBooked ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </span>
                  {isBooked && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
