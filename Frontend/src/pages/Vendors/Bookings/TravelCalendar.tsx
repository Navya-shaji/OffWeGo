/* eslint-disable react-hooks/exhaustive-deps */
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
  AlertCircle,
} from "lucide-react";
import {
  bookingdates,
  getAllUserBookings,
} from "@/services/Booking/bookingService";
import { getVendorWallet } from "@/services/Wallet/VendorWalletService";
import type { Booking } from "@/interface/Boooking";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const TravelCalendar: React.FC<{ vendorId: string }> = ({
  vendorId,
}) => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const vendorIdFromRedux = useSelector(
    (state: RootState) => state.vendorAuth.vendor?.id
  );
  console.log("TravelCalendar - vendorId from Redux:", vendorIdFromRedux); // Debug log
  console.log(
    "TravelCalendar - full vendorAuth state:",
    useSelector((state: RootState) => state.vendorAuth)
  ); // Debug log
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
  const [bookingStatuses, setBookingStatuses] = useState<
    Record<string, "not-started" | "started" | "completed">
  >({});
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>(
    []
  );

  // Helper function to get vendor ID
  const getVendorId = () => {
    const id = vendorId || vendorIdFromRedux;

    return id;
  };
  console.log(vendorId, "ven");
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const actualVendorId = getVendorId();
        if (!actualVendorId) {
          console.error("No vendorId available for wallet");
          return;
        }
        const response = await getVendorWallet(vendorId);
        setWalletBalance(response?.balance || 0);
      } catch {
        console.error("Error fetching wallet balance:");
      }
    };

    if (getVendorId()) {
      fetchWalletBalance();
    }
  }, [vendorId, vendorIdFromRedux]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const actualVendorId = getVendorId();
        if (!actualVendorId) {
          console.error("No vendorId available");
          return;
        }
        const response = await bookingdates(actualVendorId);
        setDates(response || []);
      } catch {
        console.error("Error fetching booking dates:");
        setError("Failed to load booking dates.");
      } finally {
        setLoading(false);
      }
    };

    if (getVendorId()) {
      fetchDates();
    }
  }, [vendorId, vendorIdFromRedux]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const actualVendorId = getVendorId();
        if (!actualVendorId) {
          console.error("No vendorId available for bookings");
          return;
        }
        const response = await getAllUserBookings(actualVendorId);
        if (response && Array.isArray(response)) {
          setBookingDetails(response);

          const bookingDates = response.map((booking) => booking.selectedDate);
        } else {
          console.warn("Unexpected bookings response format:", response);
          setBookingDetails([]);
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details.");
      }
    };

    if (getVendorId()) {
      fetchAllBookings();
    }
  }, [vendorId, vendorIdFromRedux]);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  }, []);

  const todaysBookings = useMemo(() => {
    const todayBookings = bookingDetails.filter((booking) => {
      if (!booking.selectedDate) {
        return false;
      }

      const bookingDate = new Date(booking.selectedDate);

      if (isNaN(bookingDate.getTime())) {
        return false;
      }

      const bookingStr = `${bookingDate.getFullYear()}-${String(
        bookingDate.getMonth() + 1
      ).padStart(2, "0")}-${String(bookingDate.getDate()).padStart(2, "0")}`;

      return bookingStr === todayStr;
    });

    return todayBookings;
  }, [bookingDetails, todayStr]);

  const bookedDatesSet = useMemo(() => {
    const datesSet = new Set(
      dates
        .map((dateStr) => {
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return null;
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(d.getDate()).padStart(2, "0")}`;
        })
        .filter(Boolean)
    );
    return datesSet;
  }, [dates]);

  const stats = useMemo(() => {
    if (dates.length === 0)
      return {
        totalBookings: 0,
        upcomingMonths: 0,
        mostBookedMonth: "N/A",
        totalRevenue: walletBalance,
        averageBookingValue: 0,
        thisMonthBookings: 0,
      };

    const monthCounts: Record<string, number> = {};
    const uniqueMonths = new Set<string>();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let thisMonthCount = 0;

    dates.forEach((dateStr) => {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return;

      const monthYear = `${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
      uniqueMonths.add(monthYear);
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;

      if (
        dateObj.getMonth() === currentMonth &&
        dateObj.getFullYear() === currentYear
      ) {
        thisMonthCount++;
      }
    });

    const mostBooked = Object.entries(monthCounts).reduce(
      (max, [month, count]) => (count > max.count ? { month, count } : max),
      { month: "N/A", count: 0 }
    );

    const completedBookings = bookingDetails.filter(
      (booking) => booking.paymentStatus === "succeeded"
    );

    const completedRevenue = completedBookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    );
    const averageBookingValue =
      completedBookings.length > 0
        ? completedRevenue / completedBookings.length
        : 0;

    return {
      totalBookings: dates.length,
      upcomingMonths: uniqueMonths.size,
      mostBookedMonth: mostBooked.month,
      totalRevenue: walletBalance,
      averageBookingValue,
      thisMonthBookings: thisMonthCount,
    };
  }, [dates, bookingDetails, walletBalance]);

  const calendarDays = useMemo(() => {
    console.log("Calculating calendar days...");

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

      const dayBookings = bookingDetails.filter((booking) => {
        if (!booking.selectedDate) return false;
        const bookingDate = new Date(booking.selectedDate);
        const bookingStr = `${bookingDate.getFullYear()}-${String(
          bookingDate.getMonth() + 1
        ).padStart(2, "0")}-${String(bookingDate.getDate()).padStart(2, "0")}`;
        return bookingStr === dateStr;
      });

      const completedDayBookings = dayBookings.filter(
        (booking) => booking.paymentStatus === "succeeded"
      );
      const dayRevenue = completedDayBookings.reduce(
        (sum, booking) => sum + (booking.totalAmount || 0),
        0
      );

      days.push({
        day,
        date: dateStr,
        isBooked,
        isWeekend,
        isToday,
        bookings: dayBookings,
        bookingCount: dayBookings.length,
        totalRevenue: dayRevenue,
      });
    }

    return days;
  }, [currentDate, bookedDatesSet, bookingDetails]);

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
      const actualVendorId = getVendorId();
      if (!actualVendorId) {
        console.error("No vendorId available for date click");
        return;
      }
      const response = await getAllUserBookings(actualVendorId);
      if (response && Array.isArray(response)) {
        const filteredDetails = response.filter((booking: Booking) => {
          if (!booking.selectedDate) return false;

          const bookingDate = new Date(booking.selectedDate);
          if (isNaN(bookingDate.getTime())) return false;

          const bookingStr = `${bookingDate.getFullYear()}-${String(
            bookingDate.getMonth() + 1
          ).padStart(2, "0")}-${String(bookingDate.getDate()).padStart(
            2,
            "0"
          )}`;
          return bookingStr === dateStr;
        });
        setSelectedDateBookings(filteredDetails || []);
      } else {
        setSelectedDateBookings([]);
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Failed to fetch booking details");
      setSelectedDateBookings([]);
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

  const getCustomerName = (booking: Booking) => {
    return booking.contactInfo?.name || booking.adults?.[0]?.name || "Customer";
  };

  const getPackageName = (booking: Booking) => {
    return booking.selectedPackage?.packageName || "Package";
  };

  const getPhoneNumber = (booking: Booking) => {
    return booking.contactInfo?.mobile || "N/A";
  };

  const getTravelerCount = (booking: Booking) => {
    const adultsCount = booking.adults?.length || 0;
    const childrenCount = booking.children?.length || 0;
    return adultsCount + childrenCount;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">
            Loading booking calendar...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-xl text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Booking Calendar
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your bookings and schedules
              </p>
            </div>
          </div>
        </div>

        {todaysBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-50 p-2 rounded-lg">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Today's Bookings
                </h2>
                <p className="text-gray-600 text-sm">
                  {todaysBookings.length} booking(s) scheduled for today
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {todaysBookings.map((booking: Booking) => {
                const status = getBookingStatus(booking._id || "");
                return (
                  <div
                    key={booking._id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getCustomerName(booking)}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
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
                        <p className="text-blue-600 font-semibold text-base mb-2">
                          {getPackageName(booking)}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{getPhoneNumber(booking)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{getTravelerCount(booking)} travelers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            <span className="font-semibold">
                              ₹{(booking.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {status === "not-started" && (
                          <button
                            onClick={() =>
                              handleStartBooking(booking._id || "")
                            }
                            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Play className="w-4 h-4" />
                            Start
                          </button>
                        )}
                        {status === "started" && (
                          <button
                            onClick={() => handleEndBooking(booking._id || "")}
                            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
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

        {selectedDateBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Bookings for{" "}
                {selectedDateBookings[0]?.selectedDate
                  ? new Date(
                      selectedDateBookings[0].selectedDate
                    ).toLocaleDateString()
                  : "Selected Date"}
              </h2>
              <button
                onClick={() => setSelectedDateBookings([])}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedDateBookings.map((booking: Booking) => (
                <div
                  key={booking._id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getCustomerName(booking)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getPackageName(booking)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getPhoneNumber(booking)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        ₹{(booking.totalAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getTravelerCount(booking)} travelers
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Bookings
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.totalBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.thisMonthBookings} this month
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Revenue
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: ₹
                  {Math.round(stats.averageBookingValue).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <IndianRupee className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Active Months
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.upcomingMonths}
                </p>
                <p className="text-xs text-gray-500 mt-1">With bookings</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Peak Month
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.mostBookedMonth}
                </p>
                <p className="text-xs text-gray-500 mt-1">Most bookings</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600 font-medium">
                Booked (Weekday)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span className="text-gray-600 font-medium">
                Booked (Weekend)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span className="text-gray-600 font-medium">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-gray-600 font-medium">Available</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-700 py-3 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayInfo, index) => {
              if (!dayInfo) {
                return (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                );
              }

              const {
                day,
                isBooked,
                isWeekend,
                isToday,
                date,
                bookingCount,
                totalRevenue,
              } = dayInfo;

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date, isBooked)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg relative transition-all cursor-pointer ${
                    isBooked
                      ? isWeekend
                        ? "bg-pink-500 text-white font-semibold hover:bg-pink-600"
                        : "bg-blue-500 text-white font-semibold hover:bg-blue-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  } ${isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                  title={
                    isBooked
                      ? `${bookingCount} booking(s) - ₹${totalRevenue.toLocaleString(
                          "en-IN"
                        )}`
                      : "Available"
                  }
                >
                  <span className="text-sm font-semibold">{day}</span>
                  {isBooked && (
                    <div className="flex items-center gap-1 mt-1">
                      {bookingCount > 1 && (
                        <span className="text-xs bg-white bg-opacity-20 px-1 rounded">
                          {bookingCount}
                        </span>
                      )}
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                  {isToday && !isBooked && (
                    <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Monthly Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Total Bookings This Month
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.thisMonthBookings}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Revenue This Month</p>
              <p className="text-3xl font-bold text-green-600">
                ₹
                {bookingDetails
                  .filter((booking) => {
                    const bookingDate = new Date(booking.selectedDate);
                    return (
                      bookingDate.getMonth() === new Date().getMonth() &&
                      bookingDate.getFullYear() === new Date().getFullYear() &&
                      booking.paymentStatus === "succeeded"
                    );
                  })
                  .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
                  .toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Average per Booking</p>
              <p className="text-3xl font-bold text-purple-600">
                ₹
                {stats.thisMonthBookings > 0
                  ? Math.round(
                      bookingDetails
                        .filter((booking) => {
                          const bookingDate = new Date(booking.selectedDate);
                          return (
                            bookingDate.getMonth() === new Date().getMonth() &&
                            bookingDate.getFullYear() ===
                              new Date().getFullYear() &&
                            booking.paymentStatus === "succeeded"
                          );
                        })
                        .reduce(
                          (sum, booking) => sum + (booking.totalAmount || 0),
                          0
                        ) / stats.thisMonthBookings
                    ).toLocaleString("en-IN")
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
