import { useEffect, useState } from "react";
import { getAllSubscriptionBookings, getSubscriptions } from "@/services/subscription/subscriptionservice";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Crown, Star, Calendar, CheckCircle, AlertCircle, Clock, Users, TrendingUp } from "lucide-react";
import type { Subscription } from "@/interface/subscription";

// Define the actual subscription booking interface based on API response
interface SubscriptionBooking {
  _id: string;
  vendorId: string;
  vendorDetails: {
    name: string;
    email: string;
  };
  planId: string;
  planName: string;
  amount: number;
  duration: number;
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookedSubscriptions() {
  const [bookings, setBookings] = useState<SubscriptionBooking[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState<SubscriptionBooking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both bookings and subscription plans
        const [bookingsRes, plansRes] = await Promise.all([
          getAllSubscriptionBookings(),
          getSubscriptions()
        ]);
       
        
        setBookings(bookingsRes.data || []);
        setSubscriptionPlans(Array.isArray(plansRes?.data) ? plansRes.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = bookings;
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.vendorDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.vendorDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    setFilteredBookings(filtered);
  }, [bookings, searchQuery, statusFilter]);

  const handleExport = () => {
    const csvContent = [
      ["Vendor Name", "Email", "Plan Name", "Amount", "Duration", "Status", "Start Date", "End Date"],
      ...filteredBookings.map((booking) => [
        booking.vendorDetails?.name || "N/A",
        booking.vendorDetails?.email || "N/A",
        booking.planName || "N/A",
        booking.amount || 0,
        booking.duration || 0,
        booking.status || "N/A",
        booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A",
        booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A",
      ]),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscription-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "expired":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName?.toLowerCase().includes("premium") || planName?.toLowerCase().includes("gold")) {
      return <Crown className="h-6 w-6 text-yellow-500" />;
    } else if (planName?.toLowerCase().includes("standard") || planName?.toLowerCase().includes("silver")) {
      return <Star className="h-6 w-6 text-gray-500" />;
    } else {
      return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading subscription bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">&#x1F4C8; Subscription Management</h1>
        <p className="text-gray-600">Monitor subscription plans, bookings, and revenue</p>
      </div>

      {/* Stats Cards - Based on Admin Created Plans */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Crown className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptionPlans.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(bookings.map(b => b.vendorId)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-blue-600" />
          Available Subscription Plans
        </h2>
        {subscriptionPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => {
              const activeBookingsForPlan = bookings.filter(b => 
                b.planId === plan._id && b.status === 'active'
              ).length;
              
              return (
                <div key={plan._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">₹{plan.price.toLocaleString()}</p>
                    </div>
                    <Badge className={plan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{plan.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Subscriptions:</span>
                      <span className="font-medium">{activeBookingsForPlan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue from plan:</span>
                      <span className="font-medium">
                        ₹{bookings
                          .filter(b => b.planId === plan._id)
                          .reduce((sum, b) => sum + (b.amount || 0), 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {plan.features && plan.features.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {plan.features.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{plan.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Crown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>No subscription plans created yet</p>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by vendor, plan, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Card Header */}
            <div className={`p-6 ${booking.status === 'active' ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 
                              booking.status === 'pending' ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : 
                              'bg-gradient-to-r from-red-50 to-rose-50'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getPlanIcon(booking.planName)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{booking.planName}</h3>
                    <p className="text-sm text-gray-600">{booking.vendorDetails?.name}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </Badge>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Price and Duration */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₹{booking.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{booking.duration} days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Vendor ID</p>
                    <p className="text-xs font-mono text-gray-500">{booking.vendorId.slice(0, 8)}...</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">{booking.vendorDetails?.email}</p>
                </div>

                {/* Date Range */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">Subscription Period</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">Start</p>
                        <p className="text-sm font-medium">{formatDate(booking.startDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">End</p>
                        <p className="text-sm font-medium">{formatDate(booking.endDate)}</p>
                      </div>
                    </div>
                    {booking.status === 'active' && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-green-600 font-medium">
                          {getDaysRemaining(booking.endDate)} days remaining
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscription bookings found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your filters or search query" 
              : "No subscription bookings have been created yet"}
          </p>
        </div>
      )}
    </div>
  );
}
