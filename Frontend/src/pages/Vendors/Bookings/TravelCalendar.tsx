import React, { useEffect, useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Star, X, Phone, Mail, MapPin, Clock, Package, DollarSign, Users } from "lucide-react";
import { bookingdates, getAllUserBookings } from "@/services/Booking/bookingService";
import type { Booking } from "@/interface/Boooking";


const TravelCalendar: React.FC<{ vendorId: string }> = ({ vendorId }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
console.log(bookingDetails,"ds")
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

  const bookedDatesSet = useMemo(() => {
    return new Set(
      dates.map(dateStr => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    );
  }, [dates]);

  const stats = useMemo(() => {
    if (dates.length === 0) return { totalBookings: 0, upcomingMonths: 0, mostBookedMonth: 'N/A' };

    const monthCounts: Record<string, number> = {};
    const uniqueMonths = new Set<string>();

    dates.forEach(dateStr => {
      const dateObj = new Date(dateStr);
      const monthYear = `${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
      uniqueMonths.add(monthYear);
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });

    const mostBooked = Object.entries(monthCounts).reduce((max, [month, count]) => 
      count > max.count ? { month, count } : max
    , { month: 'N/A', count: 0 });

    return {
      totalBookings: dates.length,
      upcomingMonths: uniqueMonths.size,
      mostBookedMonth: mostBooked.month
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
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isBooked = bookedDatesSet.has(dateStr);
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push({
        day,
        date: dateStr,
        isBooked,
        isWeekend,
        isToday
      });
    }
    
    return days;
  }, [currentDate, bookedDatesSet]);

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = async (dateStr: string, isBooked: boolean) => {
    if (!isBooked) return;
    
    setSelectedDate(dateStr);
    setLoadingDetails(true);
    
    try {
      const details = await  getAllUserBookings(vendorId);
      console.log(details,"fhjh")
      setBookingDetails(details || []);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setBookingDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setBookingDetails([]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-indigo-600 animate-pulse font-semibold">
          Loading booking dates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Booking Calendar</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
              <p className="text-5xl font-bold text-indigo-600">{stats.totalBookings}</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-xl">
              <Calendar className="w-10 h-10 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Upcoming Months</p>
              <p className="text-5xl font-bold text-indigo-600">{stats.upcomingMonths}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Most Booked Month</p>
              <p className="text-3xl font-bold text-pink-600">{stats.mostBookedMonth}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-600 rounded"></div>
              <span className="text-gray-600">Booked (Weekday)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-600 rounded"></div>
              <span className="text-gray-600">Booked (Weekend)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayInfo, index) => {
              if (!dayInfo) {
                return <div key={`empty-${index}`} className="aspect-square"></div>;
              }

              const { day, isBooked, isWeekend, isToday, date } = dayInfo;

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date, isBooked)}
                  className={`aspect-square flex items-center justify-center rounded-lg relative transition-all ${
                    isBooked
                      ? isWeekend
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold shadow-md hover:shadow-lg cursor-pointer hover:scale-105'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg cursor-pointer hover:scale-105'
                      : 'hover:bg-gray-100'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <span className={`text-lg ${isBooked ? 'text-white' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {isBooked && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      
        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{formatDate(selectedDate)}</h3>
                  <p className="text-indigo-100 mt-1">
                    {loadingDetails ? 'Loading...' : `${bookingDetails.length} booking(s)`}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

            
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-indigo-600 font-semibold">Loading booking details...</p>
                    </div>
                  </div>
                ) : bookingDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No booking details available for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookingDetails.map((booking, idx) => (
                      <div key={booking._id || idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
                      
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                            booking.paymentStatus === 'succeeded' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500 font-mono">
                            {(booking._id || 'N/A').slice(8)}
                          </span>
                        </div>

                      
                        <div className="mb-4">
                          <h4 className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Contact Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-indigo-100 p-2.5 rounded-lg flex-shrink-0">
                                <Users className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Name</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {booking.contactInfo.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-purple-100 p-2.5 rounded-lg flex-shrink-0">
                                <Mail className="w-5 h-5 text-purple-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {booking.contactInfo.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-pink-100 p-2.5 rounded-lg flex-shrink-0">
                                <Phone className="w-5 h-5 text-pink-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mobile</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {booking.contactInfo.mobile}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 p-2.5 rounded-lg flex-shrink-0">
                                <MapPin className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">City</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {booking.contactInfo.city}
                                </p>
                              </div>
                            </div>

                            {booking.contactInfo.address && (
                              <div className="flex items-start gap-3 md:col-span-2">
                                <div className="bg-green-100 p-2.5 rounded-lg flex-shrink-0">
                                  <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Address</p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {booking.contactInfo.address}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

              
                        {(booking.adults.length > 0 || booking.children.length > 0) && (
                          <div className="mb-4 pt-4 border-t border-gray-200">
                            <h4 className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Travelers</h4>
                            <div className="flex items-center gap-6">
                              {booking.adults.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Adults</p>
                                    <p className="text-lg font-bold text-indigo-600">{booking.adults.length}</p>
                                  </div>
                                </div>
                              )}
                              {booking.children.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="bg-pink-100 p-2 rounded-lg">
                                    <Users className="w-4 h-4 text-pink-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Children</p>
                                    <p className="text-lg font-bold text-pink-600">{booking.children.length}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                     
                            <div className="mt-3 space-y-2">
                              {booking.adults.map((adult, i) => (
                                <div key={`adult-${i}`} className="bg-white bg-opacity-60 rounded-lg p-3 text-sm">
                                  <span className="font-semibold text-gray-700">Adult {i + 1}:</span>{" "}
                                  <span className="text-gray-600">{adult.name}, {adult.age} years, {adult.gender}</span>
                                </div>
                              ))}
                              {booking.children.map((child, i) => (
                                <div key={`child-${i}`} className="bg-white bg-opacity-60 rounded-lg p-3 text-sm">
                                  <span className="font-semibold text-gray-700">Child {i + 1}:</span>{" "}
                                  <span className="text-gray-600">{child.name}, {child.age} years, {child.gender}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

           
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Package Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-cyan-100 p-2.5 rounded-lg flex-shrink-0">
                                <Package className="w-5 h-5 text-cyan-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Package</p>
                                <p className="text-sm font-semibold text-indigo-600">{booking.selectedPackage.packageName}</p>
                                {booking.selectedPackage.description && (
                                  <p className="text-xs text-gray-600 mt-1">{booking.selectedPackage.description}</p>
                                )}
                              </div>
                            </div>

                            {booking.selectedPackage.duration && (
                              <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2.5 rounded-lg flex-shrink-0">
                                  <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Duration</p>
                                  <p className="text-sm font-semibold text-blue-600">{booking.selectedPackage.duration} days</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start gap-3">
                              <div className="bg-orange-100 p-2.5 rounded-lg flex-shrink-0">
                                <DollarSign size={20} className="w-5 h-5 text-orange-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Package Price</p>
                                <p className="text-sm font-semibold text-orange-600">₹{booking.selectedPackage.price.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-emerald-100 p-2.5 rounded-lg flex-shrink-0">
                                <DollarSign size={20} className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Amount</p>
                                <p className="text-lg font-bold text-green-600">₹{booking.totalAmount.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>

          
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3 bg-indigo-50 rounded-lg p-3">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Booking Date</p>
                              <p className="text-sm font-semibold text-indigo-800">
                                {new Date(booking.selectedDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                    
                        {booking.paymentIntentId && (
                          <div className="mt-4 bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Payment ID</p>
                            <p className="text-sm text-gray-700 font-mono">{booking.paymentIntentId}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelCalendar;