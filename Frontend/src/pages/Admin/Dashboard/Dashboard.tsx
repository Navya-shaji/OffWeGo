import React, { useEffect, useState } from "react";
import { Users, Building2, MapPin, CreditCard, TrendingUp, Activity, BarChart3, PieChart } from "lucide-react";
import {  PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getAllUsers } from "@/services/admin/adminUserService";
import { getAllVendors } from "@/services/admin/adminVendorService";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import { getSubscriptions } from "@/services/subscription/subscriptionservice";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalDestinations: number;
  totalSubscriptions: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalDestinations: 0,
    totalSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, vendorsData, destinationsData, subscriptionsData] =
        await Promise.all([
          getAllUsers(1, 1),
          getAllVendors(1, 1),
          fetchAllDestinations(1, 1),
          getSubscriptions(),
        ]);

      setStats({
        totalUsers: usersData.totalUsers,
        totalVendors: vendorsData.totalvendors,
        totalDestinations: destinationsData.totalDestinations,
        totalSubscriptions: Array.isArray(subscriptionsData)
          ? subscriptionsData.length
          : 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };




  const distributionData = [
    { name: 'Users', value: stats.totalUsers, color: '#3b82f6' },
    { name: 'Vendors', value: stats.totalVendors, color: '#10b981' },
    { name: 'Destinations', value: stats.totalDestinations, color: '#a855f7' },
    { name: 'Subscriptions', value: stats.totalSubscriptions, color: '#f59e0b' },
  ];

 

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changePositive: true,
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      icon: Building2,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      changePositive: true,
    },
    {
      title: "Total Destinations",
      value: stats.totalDestinations,
      icon: MapPin,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      changePositive: true,
    },
    {
      title: "Total Subscriptions",
      value: stats.totalSubscriptions,
      icon: CreditCard,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      changePositive: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 text-red-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Real-time overview of your platform metrics and performance
              </p>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.iconBg} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      {card.title}
                    </p>
                    <p className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                      {card.value.toLocaleString()}
                    </p>
                  </div>

                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 rounded-tl-full`}></div>
                </div>
              </div>
            );
          })}
        </div>

     
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        

          {/* Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Distribution</h2>
                <p className="text-sm text-gray-600">Platform metrics</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => `${name} `}
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
        </div> 
        </div>
      </div>
  );
};

export default AdminDashboard;