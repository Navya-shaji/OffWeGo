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
  ArrowUpRight,
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

export default function VendorDashboard() {
  const vendor = useSelector((state: any) => state.vendorAuth.vendor);
  const vendorId = vendor?.id;

  const [stats, setStats] = useState({
    packages: 0,
    hotels: 0,
    activities: 0,
    flights: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;

    async function fetchDashboardStats() {
      try {
        setLoading(true);
        const [pkgRes, hotelRes, actRes, flightRes, bookingRes] =
          await Promise.all([
            fetchAllPackages(1, 100),
            getAllHotel(1, 100),
            getActivities(1, 100),
            fetchAllFlights(),
            getAllUserBookings(vendorId),
          ]);

        console.log('Package Response:', pkgRes);
        console.log('Hotel Response:', hotelRes);
        console.log('Activities Response:', actRes);
        console.log('Flights Response:', flightRes);
        console.log('Bookings Response:', bookingRes);

        const packageCount = pkgRes?.totalPackages || pkgRes?.packages?.length || 0;
        const hotelCount = hotelRes?.totalHotels || hotelRes?.hotels?.length || 0;
        const activityCount = actRes?.totalActivities || actRes?.activities?.length || 0;
        const flightCount = Array.isArray(flightRes) ? flightRes.length : 0;
        const bookingCount = Array.isArray(bookingRes) ? bookingRes.length : 0;
console.log(packageCount,hotelCount,activityCount,flightCount,"dhkjhdkhfhjfd")
        console.log('Calculated Stats:', {
          packages: packageCount,
          hotels: hotelCount,
          activities: activityCount,
          flights: flightCount,
          bookings: bookingCount,
        });

        setStats({
          packages: packageCount,
          hotels: hotelCount,
          activities: activityCount,
          flights: flightCount,
          bookings: bookingCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [vendorId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  const totalOfferings = stats.packages + stats.hotels + stats.activities + stats.flights;
  const bookingRate = stats.packages > 0 ? ((stats.bookings / stats.packages) * 100).toFixed(1) : 0;
  const estimatedRevenue = stats.bookings * 25000;

  const statCards = [
    {
      title: "Total Packages",
      value: stats.packages,
      description: "Active travel packages",
      icon: PackageSearch,
      change: "+12.5%",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
    {
      title: "Hotels",
      value: stats.hotels,
      description: "Listed properties",
      icon: Building2,
      change: "+8.2%",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
    {
      title: "Activities",
      value: stats.activities,
      description: "Available experiences",
      icon: Mountain,
      change: "+15.3%",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
    {
      title: "Flights",
      value: stats.flights,
      description: "Flight connections",
      icon: Plane,
      change: "+5.7%",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-900",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 lg:p-8">
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
            <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Revenue Card */}
        <Card className="border-2 border-gray-900 bg-white shadow-lg overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                    ₹{estimatedRevenue.toLocaleString()}
                  </span>
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                    +23.5%
                  </span>
                </div>
                <p className="text-gray-400 text-xs">From {stats.bookings} total bookings</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-2xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Mini Chart Visualization */}
            <div className="flex items-end justify-between h-24 gap-2">
              {[40, 65, 45, 80, 60, 95, 70, 85, 75, 90, 100, 95].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gray-200 rounded-t-lg transition-all hover:bg-gray-900" 
                  style={{ height: `${height}%` }}
                ></div>
              ))}
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
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
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
                <CardTitle className="text-base font-semibold text-gray-900">User Bookings</CardTitle>
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gray-900">{stats.bookings}</span>
                  <span className="text-green-600 text-sm font-semibold mb-1 bg-green-50 px-2 py-1 rounded">
                    +18.2%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Total bookings on your packages</p>
                
                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="border-2 border-gray-200 bg-white hover:border-gray-900 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Total Offerings</span>
                <span className="text-lg font-bold text-gray-900">{totalOfferings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Booking Rate</span>
                <span className="text-lg font-bold text-green-600">{bookingRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Avg. Rating</span>
                <span className="text-lg font-bold text-gray-900">4.8⭐</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-2 border-gray-900 bg-gray-900 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                Add New Package
              </button>
              <button className="w-full p-3 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">
                View Analytics
              </button>
              <button className="w-full p-3 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors border border-gray-700">
                Manage Bookings
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Activity Bar */}
        <Card className="border-2 border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-900" />
                <CardTitle className="text-lg font-semibold text-gray-900">Monthly Activity</CardTitle>
              </div>
              <button className="text-xs text-gray-600 hover:text-gray-900 font-medium transition-colors">
                View All →
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4 overflow-x-auto pb-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const height = Math.random() * 60 + 40;
                return (
                  <div key={month} className="flex flex-col items-center gap-2 min-w-0">
                    <div className="w-12 h-32 bg-gray-100 rounded-lg relative overflow-hidden hover:bg-gray-200 transition-colors">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-lg transition-all"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Most Active Category</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.packages >= Math.max(stats.hotels, stats.activities, stats.flights) ? "Packages" : 
               stats.hotels >= Math.max(stats.activities, stats.flights) ? "Hotels" :
               stats.activities >= stats.flights ? "Activities" : "Flights"}
            </p>
          </div>
          <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">68.5%</p>
          </div>
          <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Customer Satisfaction</p>
            <p className="text-2xl font-bold text-gray-900">96%</p>
          </div>
        </div>
      </div>
    </div>
  );
}