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
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  BarChart3,
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-semibold text-lg">Loading your dashboard</p>
            <p className="text-gray-500 text-sm">Preparing your business insights...</p>
          </div>
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
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);

  // Calculate growth percentage (comparing current month to previous)
  const currentMonth = new Date().getMonth();
  const currentMonthBookings = monthlyData[currentMonth]?.bookings || 0;
  const previousMonthBookings = currentMonth > 0
    ? monthlyData[currentMonth - 1]?.bookings || 0
    : 0;

  const growthPercentage = previousMonthBookings > 0
    ? (((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100).toFixed(1)
    : currentMonthBookings > 0 ? "100" : "0";

  const isPositiveGrowth = parseFloat(growthPercentage) >= 0;

  const statCards = [
    {
      title: "Total Packages",
      value: stats.packages,
      description: "Active travel packages",
      icon: PackageSearch,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      iconColor: "text-white",
      change: "+12%",
    },
    {
      title: "Hotels",
      value: stats.hotels,
      description: "Listed properties",
      icon: Building2,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      iconColor: "text-white",
      change: "+8%",
    },
    {
      title: "Activities",
      value: stats.activities,
      description: "Available experiences",
      icon: Mountain,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconColor: "text-white",
      change: "+15%",
    },
    {
      title: "Flights",
      value: stats.flights,
      description: "Flight connections",
      icon: Plane,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      iconColor: "text-white",
      change: "+5%",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Welcome back, {vendor?.name || "Vendor"}!
                </h1>
              </div>
              <p className="text-indigo-100 text-sm lg:text-base">
                Your business is growing! Here's your performance overview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-3 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-xs text-indigo-100">Today</p>
                    <p className="text-sm font-bold text-white">
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
        </div>

        {/* Main Revenue Card with Glassmorphism */}
        <Card className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <CardContent className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </span>
                  <span className={`text-sm font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl ${isPositiveGrowth
                      ? "text-emerald-700 bg-emerald-100"
                      : "text-red-700 bg-red-100"
                    }`}>
                    {isPositiveGrowth ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {isPositiveGrowth ? "+" : ""}{growthPercentage}%
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  From <span className="font-semibold text-gray-700">{stats.bookings}</span> total booking{stats.bookings !== 1 ? "s" : ""} this year
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Avg per Booking</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{stats.bookings > 0
                      ? Math.round(stats.totalRevenue / stats.bookings).toLocaleString("en-IN")
                      : "0"}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Monthly Revenue Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Monthly Performance</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <span>Bookings</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-32 gap-2">
                {monthlyData.map((data, i) => {
                  const height = maxBookings > 0
                    ? (data.bookings / maxBookings) * 100
                    : 0;
                  const isCurrentMonth = i === currentMonth;
                  return (
                    <div
                      key={i}
                      className="flex-1 relative group"
                    >
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer ${isCurrentMonth
                            ? "bg-gradient-to-t from-indigo-600 to-purple-600 shadow-lg"
                            : "bg-gradient-to-t from-indigo-400 to-purple-400 hover:from-indigo-600 hover:to-purple-600"
                          }`}
                        style={{ height: `${Math.max(height, 8)}%` }}
                      >
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                          <p className="font-semibold">{data.month}</p>
                          <p>{data.bookings} bookings</p>
                          <p>₹{data.revenue.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                {monthlyData.map((data, i) => (
                  <span key={i} className="flex-1 text-center">{data.month}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-semibold text-gray-700">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Grid - Enhanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* User Bookings Card */}
          <Card className="border-0 bg-white shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  User Bookings
                </CardTitle>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stats.bookings}</span>
                  <span className={`text-sm font-bold mb-2 px-3 py-1 rounded-lg flex items-center gap-1 ${isPositiveGrowth
                      ? "text-emerald-700 bg-emerald-100"
                      : "text-red-700 bg-red-100"
                    }`}>
                    {isPositiveGrowth ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositiveGrowth ? "+" : ""}{growthPercentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Total bookings on your packages</p>

                {/* Enhanced Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="font-medium">Booking Rate</span>
                    <span className="font-bold text-indigo-600">{bookingRate}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${Math.min(parseFloat(bookingRate), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="border-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <span className="text-sm font-medium">Total Offerings</span>
                <span className="text-2xl font-bold">{totalOfferings}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <span className="text-sm font-medium">Booking Rate</span>
                <span className="text-2xl font-bold">{bookingRate}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <span className="text-sm font-medium">Avg Revenue</span>
                <span className="text-xl font-bold">
                  ₹{stats.bookings > 0
                    ? Math.round(stats.totalRevenue / stats.bookings).toLocaleString("en-IN")
                    : "0"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <p className="text-xs text-emerald-100 mb-1">Most Active Category</p>
                <p className="text-xl font-bold">{getMostActiveCategory()}</p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <p className="text-xs text-emerald-100 mb-1">This Month</p>
                <p className="text-xl font-bold">
                  {monthlyData[currentMonth]?.bookings || 0} Bookings
                </p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <p className="text-xs text-emerald-100 mb-1">Monthly Revenue</p>
                <p className="text-xl font-bold">
                  ₹{(monthlyData[currentMonth]?.revenue || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Monthly Activity Chart */}
        <Card className="border-0 bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Monthly Bookings Overview
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Track your booking trends throughout the year</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-indigo-50 rounded-xl">
                <p className="text-xs font-semibold text-indigo-600">{new Date().getFullYear()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-3 pb-2">
              {monthlyData.map((data, i) => {
                const height = maxBookings > 0
                  ? (data.bookings / maxBookings) * 100
                  : 0;
                const isCurrentMonth = i === currentMonth;
                return (
                  <div key={data.month} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-full h-40 bg-gradient-to-t from-gray-100 to-gray-50 rounded-xl relative overflow-hidden group cursor-pointer">
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-xl transition-all duration-700 ${isCurrentMonth
                            ? "bg-gradient-to-t from-indigo-600 to-purple-600 shadow-lg"
                            : "bg-gradient-to-t from-indigo-400 to-purple-400 group-hover:from-indigo-600 group-hover:to-purple-600"
                          }`}
                        style={{ height: `${Math.max(height, 8)}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                          <span className="text-xs font-bold text-gray-900 block">{data.bookings}</span>
                          <span className="text-xs text-gray-600">bookings</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold ${isCurrentMonth ? 'text-indigo-600' : 'text-gray-500'}`}>
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats Row with Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all"></div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-2 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all"></div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-2 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.bookings}
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
            <div className={`absolute inset-0 ${isPositiveGrowth
                ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20"
                : "bg-gradient-to-br from-red-500/10 to-orange-500/10 group-hover:from-red-500/20 group-hover:to-orange-500/20"
              } transition-all`}></div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-2 font-medium">Growth Rate</p>
              <p className={`text-3xl font-bold flex items-center gap-2 ${isPositiveGrowth
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
                }`}>
                {isPositiveGrowth ? <TrendingUp className="w-6 h-6 text-emerald-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                {isPositiveGrowth ? "+" : ""}{growthPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}