"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Plane,
  Building2,
  Mountain,
  PackageSearch,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useSelector } from "react-redux";
import { fetchAllPackages } from "@/services/packages/packageService";
import { getAllHotel } from "@/services/Hotel/HotelService";
import { getActivities } from "@/services/Activity/ActivityService";
import { fetchAllFlights } from "@/services/Flight/FlightService";
import { getAllUserBookings } from "@/services/Booking/bookingService";
import type { RootState } from "@/store/store";

interface MonthlyData {
  month: string;
  bookings: number;
  revenue: number;
}

export default function VendorDashboard() {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const vendorId = vendor?.id;

  const [stats, setStats] = useState({
    packages: 0,
    hotels: 0,
    activities: 0,
    flights: 0,
    bookings: 0,
    totalRevenue: 0,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;

    async function fetchDashboardStats() {
      try {
        setLoading(true);
        const [pkgRes, hotelRes, actRes, flightRes, bookingRes] =
          await Promise.all([
            fetchAllPackages(1, 1000),
            getAllHotel(1, 1000),
            getActivities(1, 1000),
            fetchAllFlights(),
            getAllUserBookings(vendorId),
          ]);

        const packageCount = pkgRes?.totalPackages || pkgRes?.packages?.length || 0;
        const hotelCount = hotelRes?.totalHotels || hotelRes?.hotels?.length || 0;
        const activityCount = actRes?.totalActivities || actRes?.activities?.length || 0;
        const flightCount = Array.isArray(flightRes) ? flightRes.length : 0;
        const bookings = Array.isArray(bookingRes) ? bookingRes : [];
        const bookingCount = bookings.length;

        const totalRevenue = bookings.reduce((sum: number, booking: any) => {
          return sum + (booking.totalAmount || 0);
        }, 0);

        const monthlyStats = processMonthlyData(bookings);

        setStats({
          packages: packageCount,
          hotels: hotelCount,
          activities: activityCount,
          flights: flightCount,
          bookings: bookingCount,
          totalRevenue: totalRevenue,
        });

        setMonthlyData(monthlyStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [vendorId]);

  const processMonthlyData = (bookings: any[]): MonthlyData[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    const monthlyMap = new Map<string, { bookings: number; revenue: number }>();
    months.forEach(month => {
      monthlyMap.set(month, { bookings: 0, revenue: 0 });
    });

    bookings.forEach((booking: any) => {
      const bookingDate = new Date(booking.selectedDate || booking.createdAt);
      if (bookingDate.getFullYear() === currentYear) {
        const monthName = months[bookingDate.getMonth()];
        const current = monthlyMap.get(monthName)!;
        current.bookings += 1;
        current.revenue += booking.totalAmount || 0;
      }
    });

    return months.map(month => ({
      month,
      bookings: monthlyMap.get(month)!.bookings,
      revenue: monthlyMap.get(month)!.revenue,
    }));
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          <span className="ml-3 text-slate-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const totalOfferings = stats.packages + stats.hotels + stats.activities + stats.flights;
  const bookingRate = stats.packages > 0
    ? ((stats.bookings / stats.packages) * 100).toFixed(1)
    : "0";

  const maxBookings = Math.max(...monthlyData.map(d => d.bookings), 1);

  const currentMonth = new Date().getMonth();
  const currentMonthBookings = monthlyData[currentMonth]?.bookings || 0;
  const previousMonthBookings = currentMonth > 0
    ? monthlyData[currentMonth - 1]?.bookings || 0
    : 0;

  const growthPercentage = previousMonthBookings > 0
    ? (((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100).toFixed(1)
    : currentMonthBookings > 0 ? "100" : "0";

  const isPositiveGrowth = parseFloat(growthPercentage) >= 0;

  const getMostActiveCategory = () => {
    const max = Math.max(stats.packages, stats.hotels, stats.activities, stats.flights);
    if (max === 0) return "None";
    if (stats.packages === max) return "Packages";
    if (stats.hotels === max) return "Hotels";
    if (stats.activities === max) return "Activities";
    return "Flights";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {vendor?.name || "Vendor"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1 rounded-full text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Packages */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <PackageSearch className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.packages}</p>
            <p className="text-sm text-gray-600">Total Packages</p>
          </div>
        </div>

        {/* Hotels */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.hotels}</p>
            <p className="text-sm text-gray-600">Hotels</p>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mountain className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activities}</p>
            <p className="text-sm text-gray-600">Activities</p>
          </div>
        </div>

        {/* Flights */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Plane className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.flights}</p>
            <p className="text-sm text-gray-600">Flights</p>
          </div>
        </div>
      </div>

      {/* Revenue and Bookings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
              </div>
              <span className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded ${isPositiveGrowth
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
                }`}>
                {isPositiveGrowth ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositiveGrowth ? "+" : ""}{growthPercentage}%
              </span>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                From {stats.bookings} total bookings • Avg: ₹
                {stats.bookings > 0
                  ? Math.round(stats.totalRevenue / stats.bookings).toLocaleString("en-IN")
                  : "0"}
              </p>
            </div>

            {/* Monthly Bar Chart */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Monthly Performance</p>
              {monthlyData.map((data, i) => {
                const percentage = maxBookings > 0 ? (data.bookings / maxBookings) * 100 : 0;
                const isCurrentMonth = i === currentMonth;

                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-xs font-medium w-8 ${isCurrentMonth ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                      {data.month}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isCurrentMonth ? "bg-slate-800" : "bg-slate-400 hover:bg-slate-600"
                          }`}
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      >
                        {data.bookings > 0 && (
                          <span className="text-xs font-semibold text-white px-2 flex items-center h-full">
                            {data.bookings}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-12 text-right">
                      ₹{(data.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Bookings Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">User Bookings</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.bookings}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${isPositiveGrowth
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                  }`}>
                  {isPositiveGrowth ? "+" : ""}{growthPercentage}%
                </span>
                <span className="text-xs text-gray-600">vs last month</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Booking Rate</span>
                  <span className="font-semibold">{bookingRate}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full transition-all"
                    style={{ width: `${Math.min(parseFloat(bookingRate), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Offerings</span>
                  <span className="font-bold text-gray-900">{totalOfferings}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Most Active</span>
                  <span className="font-bold text-gray-900">{getMostActiveCategory()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-gray-900">
                    {monthlyData[currentMonth]?.bookings || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-slate-800 text-white rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <p className="text-xs text-gray-300 mb-1">This Month Revenue</p>
              <p className="text-2xl font-bold">
                ₹{(monthlyData[currentMonth]?.revenue || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
