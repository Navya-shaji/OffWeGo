/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PackageSearch,
  Users,
  TrendingUp,
  TrendingDown,

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
import { getAllUserBookings } from "@/services/Booking/bookingService";
import { getVendorWallet } from "@/services/Wallet/VendorWalletService";
import type { RootState } from "@/store/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

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
        if (!vendorId) return;

        const [pkgRes, bookingRes, walletRes] =
          await Promise.all([
            fetchAllPackages(1, 1000),
            getAllUserBookings(vendorId),
            getVendorWallet(vendorId).catch(() => null), // Fetch wallet, but don't fail if it doesn't exist
          ]);

        const packageCount = pkgRes?.totalPackages || pkgRes?.packages?.length || 0;
        const bookings = Array.isArray(bookingRes) ? bookingRes : [];
        const bookingCount = bookings.length;

        // Calculate total revenue from wallet balance instead of bookings
        // Wallet balance represents the actual earnings in the vendor's wallet
        const totalRevenue = walletRes?.balance || 0;

        // Process monthly data from actual bookings
        const monthlyStats = processMonthlyData(bookings);

        setStats({
          packages: packageCount,
          hotels: 0,
          activities: 0,
          flights: 0,
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <LoadingSpinner size="xl" color="#374151" />
          <div className="mt-6 space-y-2">
            <p className="text-gray-900 font-bold text-xl font-serif">Loading your dashboard</p>
            <p className="text-gray-500 text-sm italic">Preparing your business insights...</p>
          </div>
        </div>
      </div>
    );
  }


  const bookingRate = stats.packages > 0
    ? ((stats.bookings / stats.packages) * 100).toFixed(1)
    : "0";


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
      title: "Total Bookings",
      value: stats.bookings,
      description: "Bookings on packages",
      icon: Users,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      iconColor: "text-white",
      change: `${isPositiveGrowth ? '+' : ''}${growthPercentage}%`,
    },
    {
      title: "Wallet Balance",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      description: "Available earnings",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconColor: "text-white",
      change: "Active",
    },
    {
      title: "Avg Revenue",
      value: `₹${stats.bookings > 0 ? Math.round(stats.totalRevenue / stats.bookings).toLocaleString("en-IN") : "0"}`,
      description: "Revenue per booking",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      iconColor: "text-white",
      change: "Stable",
    },
  ];

  return (
    <div className="w-full bg-transparent">
      <div className="w-full space-y-6">
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                Welcome back, {vendor?.name || "Vendor"}!
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Your business is growing! Here's your performance overview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
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
        </div>

        {/* Main Revenue Card */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl lg:text-6xl font-bold text-gray-900">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </span>
                  <span className={`text-sm font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg ${isPositiveGrowth
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                    }`}>
                    {isPositiveGrowth ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {isPositiveGrowth ? "+" : ""}{growthPercentage}%
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  Current wallet balance from all transactions
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

            {/* Enhanced Monthly Performance Graph */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Monthly Performance</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-700"></div>
                    <span>Bookings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-400"></div>
                    <span>Revenue</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: '11px' }}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '11px' }}
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'bookings') {
                          return [`${value} bookings`, 'Bookings'];
                        }
                        return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                      }}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="#374151"
                      radius={[4, 4, 0, 0]}
                      name="Bookings"
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#9ca3af"
                      radius={[4, 4, 0, 0]}
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon className="w-6 h-6 text-gray-700" />
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
          <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  User Bookings
                </CardTitle>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-gray-900">{stats.bookings}</span>
                  <span className={`text-sm font-bold mb-2 px-3 py-1 rounded-lg flex items-center gap-1 ${isPositiveGrowth
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                    }`}>
                    {isPositiveGrowth ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositiveGrowth ? "+" : ""}{growthPercentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Total bookings on your packages</p>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="font-medium">Booking Rate</span>
                    <span className="font-bold text-gray-900">{bookingRate}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(parseFloat(bookingRate), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
                <BarChart3 className="w-5 h-5 text-gray-700" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Vendor Status</span>
                <span className="text-lg font-bold text-emerald-600 uppercase tracking-wider">{vendor?.status || "Active"}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Booking Rate</span>
                <span className="text-2xl font-bold text-gray-900">{bookingRate}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Avg Revenue</span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{stats.bookings > 0
                    ? Math.round(stats.totalRevenue / stats.bookings).toLocaleString("en-IN")
                    : "0"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
                <Sparkles className="w-5 h-5 text-gray-700" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Top Performing</p>
                <p className="text-xl font-bold text-gray-900">Packages</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {monthlyData[currentMonth]?.bookings || 0} Bookings
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Monthly Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{(monthlyData[currentMonth]?.revenue || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Booking Graph with Recharts */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Booking Trends Graph
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Visual representation of bookings and revenue throughout the year</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs font-semibold text-gray-700">{new Date().getFullYear()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recharts Bar Chart */}
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'bookings') {
                          return [`${value} bookings`, 'Bookings'];
                        }
                        return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value) => {
                        if (value === 'bookings') return 'Bookings';
                        if (value === 'revenue') return 'Revenue (₹)';
                        return value;
                      }}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="#374151"
                      radius={[4, 4, 0, 0]}
                      name="bookings"
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#9ca3af"
                      radius={[4, 4, 0, 0]}
                      name="revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart for Trend */}
              <div className="w-full h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'bookings') {
                          return [`${value} bookings`, 'Bookings'];
                        }
                        return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#374151"
                      strokeWidth={3}
                      dot={{ fill: '#374151', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Bookings Trend"
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#9ca3af"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#9ca3af', r: 4 }}
                      name="Revenue Trend"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Peak Month</p>
                  <p className="text-sm font-bold text-gray-900">
                    {monthlyData.reduce((max, data) => data.bookings > max.bookings ? data : max, monthlyData[0])?.month || "N/A"}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                  <p className="text-sm font-bold text-gray-900">{stats.bookings}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Avg/Month</p>
                  <p className="text-sm font-bold text-gray-900">
                    {Math.round(stats.bookings / 12)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}