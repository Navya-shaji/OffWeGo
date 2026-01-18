/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Users, Building2, MapPin, CreditCard, Activity, BarChart3, PieChart, Package, TrendingUp, DollarSign, Calendar, BookOpen } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { getAllUsers } from "@/services/admin/adminUserService";
import { getAllVendors } from "@/services/admin/adminVendorService";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import { getSubscriptions, getAllSubscriptionBookings } from "@/services/subscription/subscriptionservice";
import { getAllBookingsAdmin } from "@/services/Booking/bookingService";
import { fetchAllPackages } from "@/services/packages/packageService";
import { getWallet } from "@/services/Wallet/AdminWalletService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalDestinations: number;
  totalSubscriptions: number;
  totalBookings: number;
  totalPackages: number;
  totalRevenue: number;
  totalSubscriptionRevenue: number;
  activeSubscriptionsCount: number;
  bookingsByStatus: {
    active: number;
    completed: number;
    pending: number;
  };
}

interface MonthlyData {
  month: string;
  bookings: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const admin = useSelector((state: RootState) => state.adminAuth?.admin);
  const adminId = admin?.id

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalDestinations: 0,
    totalSubscriptions: 0,
    totalBookings: 0,
    totalPackages: 0,
    totalRevenue: 0,
    totalSubscriptionRevenue: 0,
    activeSubscriptionsCount: 0,
    bookingsByStatus: {
      active: 0,
      completed: 0,
      pending: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, vendorsData, destinationsData, subscriptionsData, bookingsData, packagesData, walletData, subHistory] =
        await Promise.all([
          getAllUsers(1, 1),
          getAllVendors(1, 1),
          fetchAllDestinations(1, 1),
          getSubscriptions(),
          getAllBookingsAdmin().catch(() => []),
          fetchAllPackages(1, 1).catch(() => ({ totalPackages: 0 })),
          adminId ? getWallet(adminId).catch(() => null) : Promise.resolve(null),
          getAllSubscriptionBookings().catch(() => ({ data: [] })),
        ]);

      const bookings = Array.isArray(bookingsData) ? bookingsData : [];
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter((b: any) =>
        b.bookingStatus === "ongoing" || b.status === "ongoing"
      ).length;
      const completedBookings = bookings.filter((b: any) =>
        b.bookingStatus === "completed" || b.status === "completed"
      ).length;
      const pendingBookings = bookings.filter((b: any) =>
        b.bookingStatus === "pending" || b.status === "pending" || b.paymentStatus === "pending"
      ).length;

      const subBookings = Array.isArray(subHistory?.data) ? subHistory.data : [];

      const totalSubscriptionRevenue = subBookings.reduce((sum: number, sub: any) =>
        sub.status === 'active' ? sum + (sub.amount || 0) : sum, 0);

      const activeSubscriptionsCount = subBookings.filter((sub: any) =>
        sub.status === 'active').length;

      const totalRevenue = (walletData?.balance || 0) + totalSubscriptionRevenue;

      // Process monthly data
      const monthlyStats = processMonthlyData(bookings);

      setStats({
        totalUsers: usersData.totalUsers || 0,
        totalVendors: vendorsData.totalvendors || 0,
        totalDestinations: destinationsData.totalDestinations || 0,
        totalSubscriptions: Array.isArray(subscriptionsData) ? subscriptionsData.length : (Array.isArray(subscriptionsData?.data) ? subscriptionsData.data.length : 0),
        totalBookings,
        totalPackages: packagesData?.totalPackages || 0,
        totalRevenue,
        totalSubscriptionRevenue,
        activeSubscriptionsCount,
        bookingsByStatus: {
          active: activeBookings,
          completed: completedBookings,
          pending: pendingBookings,
        },
      });

      setMonthlyData(monthlyStats);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

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

  const distributionData = [
    { name: 'Users', value: stats.totalUsers, color: '#4b5563' },
    { name: 'Vendors', value: stats.totalVendors, color: '#6b7280' },
    { name: 'Destinations', value: stats.totalDestinations, color: '#9ca3af' },
    { name: 'Subscriptions', value: stats.totalSubscriptions, color: '#d1d5db' },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: Building2,
      bgColor: "bg-gray-200",
      iconColor: "text-gray-900",
      borderColor: "border-gray-400",
    },
    {
      title: "Total Destinations",
      value: stats.totalDestinations,
      icon: MapPin,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    {
      title: "Total Subscriptions",
      value: stats.totalSubscriptions,
      icon: CreditCard,
      bgColor: "bg-gray-200",
      iconColor: "text-gray-900",
      borderColor: "border-gray-400",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: BookOpen,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    {
      title: "Total Packages",
      value: stats.totalPackages,
      icon: Package,
      bgColor: "bg-gray-200",
      iconColor: "text-gray-900",
      borderColor: "border-gray-400",
    },
    {
      title: "Active Bookings",
      value: stats.bookingsByStatus.active,
      icon: Activity,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-800",
      borderColor: "border-gray-300",
    },
    {
      title: "Completed Bookings",
      value: stats.bookingsByStatus.completed,
      icon: Calendar,
      bgColor: "bg-gray-200",
      iconColor: "text-gray-900",
      borderColor: "border-gray-400",
    },
  ];

  const bookingStatusData = [
    { name: 'Active', value: stats.bookingsByStatus.active, color: '#6b7280' },
    { name: 'Completed', value: stats.bookingsByStatus.completed, color: '#9ca3af' },
    { name: 'Pending', value: stats.bookingsByStatus.pending, color: '#d1d5db' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="#111827" />
          <p className="mt-4 text-gray-600 font-medium font-serif italic">Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 text-gray-800 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Error Loading Dashboard</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Real-time overview of your platform metrics and performance
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Revenue</p>
                  <p className="text-5xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 text-sm">From all bookings and transactions</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.bgColor} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 border ${card.borderColor}`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      {card.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </p>
                  </div>

                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-100 opacity-50 rounded-tl-full"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-300">
                <PieChart className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Platform Distribution</h2>
                <p className="text-sm text-gray-600">Users, Vendors, Destinations & Subscriptions</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          {/* Booking Status Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-300">
                <BookOpen className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Booking Status</h2>
                <p className="text-sm text-gray-600">Active, Completed & Pending</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-300">
              <TrendingUp className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Monthly Revenue & Bookings</h2>
              <p className="text-sm text-gray-600">Revenue and booking trends for the current year</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="bookings" fill="#6b7280" name="Bookings" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="#1f2937" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Pending Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.bookingsByStatus.pending}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <Calendar className="w-6 h-6 text-gray-800" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Active Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.bookingsByStatus.active}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <Activity className="w-6 h-6 text-gray-800" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Completed Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.bookingsByStatus.completed}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
