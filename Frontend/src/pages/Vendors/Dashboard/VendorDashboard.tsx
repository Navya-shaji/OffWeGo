"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Plane,
  Building2,
  Mountain,
  PackageSearch,
  Users,
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

        setStats({
          packages: pkgRes.totalPackages,
          hotels: hotelRes.totalHotels,
          activities: actRes.totalActivities,
          flights: flightRes.length,
          bookings: bookingRes.length,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [vendorId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  const statCards = [
    {
      title: "Total Packages",
      value: stats.packages,
      description: "Packages created by you",
      icon: PackageSearch,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Hotels Added",
      value: stats.hotels,
      description: "Hotels linked to destinations",
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Activities Added",
      value: stats.activities,
      description: "Adventure / local activities",
      icon: Mountain,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Flights Added",
      value: stats.flights,
      description: "Flights available for packages",
      icon: Plane,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "User Bookings",
      value: stats.bookings,
      description: "Total bookings made on your packages",
      icon: Users,
      gradient: "from-rose-500 to-rose-600",
      bgGradient: "from-rose-50 to-rose-100",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back, {vendor?.name || "Vendor"}! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.bgGradient}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-700">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-600">
                    {stat.description}
                  </p>
                </CardContent>
                
                {/* Decorative gradient bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
              </Card>
            );
          })}
        </div>

        {/* Quick insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Total Offerings</span>
                <span className="text-lg font-bold text-slate-800">
                  {stats.packages + stats.hotels + stats.activities + stats.flights}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-600">Booking Rate</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats.packages > 0 ? ((stats.bookings / stats.packages) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-800 to-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Most Active Category</span>
                <span className="text-sm font-semibold">
                  {stats.packages >= Math.max(stats.hotels, stats.activities, stats.flights) ? "Packages" : 
                   stats.hotels >= Math.max(stats.activities, stats.flights) ? "Hotels" :
                   stats.activities >= stats.flights ? "Activities" : "Flights"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Total Bookings</span>
                <span className="text-2xl font-bold">{stats.bookings}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}