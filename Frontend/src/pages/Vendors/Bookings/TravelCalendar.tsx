import React, { useEffect, useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { bookingdates } from "@/services/Booking/bookingService";

const TravelCalendar: React.FC<{ vendorId: string }> = ({ vendorId }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

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

              const { day, isBooked, isWeekend, isToday } = dayInfo;

              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-lg relative transition-all ${
                    isBooked
                      ? isWeekend
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold shadow-md hover:shadow-lg'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md hover:shadow-lg'
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
      </div>
    </div>
  );
};

export default TravelCalendar;