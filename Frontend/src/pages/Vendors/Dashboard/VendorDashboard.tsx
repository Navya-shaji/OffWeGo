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
  Activity,
  Calendar,
  DollarSign,
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

        // Calculate total revenue from actual bookings
        const totalRevenue = bookings.reduce((sum: number, booking: any) => {
          return sum + (booking.totalAmount || 0);
        }, 0);

        // Process monthly data from actual bookings
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
    
    // Initialize all months with zero values
    const monthlyMap = new Map<string, { bookings: number; revenue: number }>();
    months.forEach(month => {
      monthlyMap.set(month, { bookings: 0, revenue: 0 });
    });

    // Process actual bookings
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalOfferings = stats.packages + stats.hotels + stats.activities + stats.flights;
  const bookingRate = stats.packages > 0 
    ? ((stats.bookings / stats.packages) * 100).toFixed(1)
    : "0";

  // Get max bookings for chart scaling
  const maxBookings = Math.max(...monthlyData.map(d => d.bookings), 1);

  // Calculate growth percentage (comparing current month to previous)
  const currentMonth = new Date().getMonth();
  const currentMonthBookings = monthlyData[currentMonth]?.bookings || 0;
  const previousMonthBookings = currentMonth > 0 
    ? monthlyData[currentMonth - 1]?.bookings || 0 
    : 0;
  
  const growthPercentage = previousMonthBookings > 0
    ? (((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100).toFixed(1)
    : currentMonthBookings > 0 ? "100" : "0";

  const statCards = [
    {
      title: "Total Packages",
      value: stats.packages,
      description: "Active travel packages",
      icon: PackageSearch,
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
    {
      title: "Hotels",
      value: stats.hotels,
      description: "Listed properties",
      icon: Building2,
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
    {
      title: "Activities",
      value: stats.activities,
      description: "Available experiences",
      icon: Mountain,
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
    {
      title: "Flights",
      value: stats.flights,
      description: "Flight connections",
      icon: Plane,
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
  ];

  // Get most active category
  const getMostActiveCategory = () => {
    const max = Math.max(stats.packages, stats.hotels, stats.activities, stats.flights);
    if (max === 0) return "None";
    if (stats.packages === max) return "Packages";
    if (stats.hotels === max) return "Hotels";
    if (stats.activities === max) return "Activities";
    return "Flights";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Welcome back, {vendor?.name || "Vendor"}!
            </h1>
            <p className="text-gray-500 text-sm lg:text-base">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Revenue Card */}
        <Card className="border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </span>
                  <span className={`text-sm font-semibold flex items-center gap-1 px-2 py-1 rounded-lg ${
                    parseFloat(growthPercentage) >= 0 
                      ? "text-green-600 bg-green-50" 
                      : "text-red-600 bg-red-50"
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  From {stats.bookings} total booking{stats.bookings !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="p-3 bg-gray-900 rounded-2xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="flex items-end justify-between h-24 gap-2">
              {monthlyData.map((data, i) => {
                const height = maxBookings > 0 
                  ? (data.bookings / maxBookings) * 100 
                  : 0;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-gray-200 rounded-t-lg transition-all hover:bg-gray-900 cursor-pointer relative group"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${data.month}: ${data.bookings} bookings, ₹${data.revenue.toLocaleString("en-IN")}`}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {data.bookings} bookings
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-2 border-gray-200 bg-white hover:border-gray-900 transition-all duration-300 hover:shadow-lg group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-semibold text-gray-700">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Grid - Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* User Bookings Card */}
          <Card className="border-2 border-gray-200 bg-white hover:border-gray-900 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  User Bookings
                </CardTitle>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gray-900">{stats.bookings}</span>
                  <span className={`text-sm font-semibold mb-1 px-2 py-1 rounded ${
                    parseFloat(growthPercentage) >= 0 
                      ? "text-green-600 bg-green-50" 
                      : "text-red-600 bg-red-50"
                  }`}>
                    {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Total bookings on your packages</p>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Booking Rate</span>
                    <span className="font-semibold">{bookingRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 rounded-full transition-all" 
                      style={{ width: `${Math.min(parseFloat(bookingRate), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="border-2 border-gray-200 bg-white hover:border-gray-900 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Total Offerings</span>
                <span className="text-lg font-bold text-gray-900">{totalOfferings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Booking Rate</span>
                <span className="text-lg font-bold text-gray-900">{bookingRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Avg Revenue/Booking</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{stats.bookings > 0 
                    ? Math.round(stats.totalRevenue / stats.bookings).toLocaleString("en-IN")
                    : "0"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="border-2 border-gray-900 bg-gray-900 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Most Active</p>
                <p className="text-lg font-bold">{getMostActiveCategory()}</p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">This Month</p>
                <p className="text-lg font-bold">
                  {monthlyData[new Date().getMonth()]?.bookings || 0} Bookings
                </p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Monthly Revenue</p>
                <p className="text-lg font-bold">
                  ₹{(monthlyData[new Date().getMonth()]?.revenue || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Activity Chart */}
        <Card className="border-2 border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-900" />
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Monthly Bookings Overview
                </CardTitle>
              </div>
              <p className="text-xs text-gray-500">Current Year</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4 pb-2">
              {monthlyData.map((data, i) => {
                const height = maxBookings > 0 
                  ? (data.bookings / maxBookings) * 100 
                  : 0;
                return (
                  <div key={data.month} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-full h-32 bg-gray-100 rounded-lg relative overflow-hidden hover:bg-gray-200 transition-colors group">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-lg transition-all"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-gray-900">{data.bookings}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
          </div>
          <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Growth Rate</p>
            <p className={`text-2xl font-bold ${
              parseFloat(growthPercentage) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}