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
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  BarChart3,
  Download,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";
import { fetchAllPackages } from "@/services/packages/packageService";
import { getAllHotel } from "@/services/Hotel/HotelService";
import { getActivities } from "@/services/Activity/ActivityService";
import { fetchAllFlights } from "@/services/Flight/FlightService";
import { getAllUserBookings } from "@/services/Booking/bookingService";
import { getVendorWallet } from "@/services/Wallet/VendorWalletService";
import type { RootState } from "@/store/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import jsPDF from "jspdf";

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
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showInvoiceDropdown && !target.closest('.invoice-dropdown-container')) {
        setShowInvoiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInvoiceDropdown]);

  useEffect(() => {
    if (!vendorId) return;

    async function fetchDashboardStats() {
      try {
        setLoading(true);
        if (!vendorId) return;
        
        const [pkgRes, hotelRes, actRes, flightRes, bookingRes, walletRes] =
          await Promise.all([
            fetchAllPackages(1, 1000),
            getAllHotel(1, 1000),
            getActivities(1, 1000),
            fetchAllFlights(),
            getAllUserBookings(vendorId),
            getVendorWallet(vendorId).catch(() => null), // Fetch wallet, but don't fail if it doesn't exist
          ]);

        const packageCount = pkgRes?.totalPackages || pkgRes?.packages?.length || 0;
        const hotelCount = hotelRes?.totalHotels || hotelRes?.hotels?.length || 0;
        const activityCount = actRes?.totalActivities || actRes?.activities?.length || 0;
        const flightCount = Array.isArray(flightRes) ? flightRes.length : 0;
        const bookings = Array.isArray(bookingRes) ? bookingRes : [];
        const bookingCount = bookings.length;

        // Calculate total revenue from wallet balance instead of bookings
        // Wallet balance represents the actual earnings in the vendor's wallet
        const totalRevenue = walletRes?.balance || 0;

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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-gray-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
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

  // Invoice download function - PDF generation
  const handleDownloadInvoice = (period: "monthly" | "yearly") => {
    const currentDate = new Date();
    let invoiceData = {
      vendorName: vendor?.name || "Vendor",
      vendorEmail: vendor?.email || "",
      period: period,
      dateRange: "",
      totalRevenue: 0,
      totalBookings: 0,
      monthlyBreakdown: [] as MonthlyData[],
    };

    if (period === "monthly") {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const monthName = monthlyData[currentMonth]?.month || currentDate.toLocaleString("default", { month: "long" });
      
      invoiceData.dateRange = `${monthName} ${currentYear}`;
      invoiceData.totalRevenue = monthlyData[currentMonth]?.revenue || 0;
      invoiceData.totalBookings = monthlyData[currentMonth]?.bookings || 0;
      invoiceData.monthlyBreakdown = [monthlyData[currentMonth]];
    } else {
      const currentYear = currentDate.getFullYear();
      invoiceData.dateRange = `${currentYear}`;
      invoiceData.totalRevenue = stats.totalRevenue;
      invoiceData.totalBookings = stats.bookings;
      invoiceData.monthlyBreakdown = monthlyData;
    }

    // Create PDF with professional formatting
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header Section with Border
    pdf.setFillColor(0, 0, 0);
    pdf.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE", pageWidth / 2, yPosition + 8, { align: "center" });
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${invoiceData.period.toUpperCase()} REPORT`, pageWidth / 2, yPosition + 15, { align: "center" });
    
    pdf.setTextColor(0, 0, 0);
    yPosition += 35;

    // Company/Vendor Information Box
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(20, yPosition, pageWidth - 40, 30);
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Vendor Details", 25, yPosition + 8);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${invoiceData.vendorName}`, 25, yPosition + 15);
    pdf.text(`Email: ${invoiceData.vendorEmail}`, 25, yPosition + 21);
    pdf.text(`Period: ${invoiceData.dateRange}`, 25, yPosition + 27);
    
    // Invoice Details (Right side)
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}`;
    pdf.text(`Invoice #: ${invoiceNumber}`, pageWidth - 25, yPosition + 8, { align: "right" });
    pdf.text(`Date: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`, pageWidth - 25, yPosition + 14, { align: "right" });
    
    yPosition += 40;

    // Summary Section with Box
    pdf.setFillColor(245, 245, 245);
    pdf.rect(20, yPosition, pageWidth - 40, 25, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary", 25, yPosition + 10);
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Revenue:`, 25, yPosition + 18);
    pdf.setFont("helvetica", "bold");
    pdf.text(`₹${invoiceData.totalRevenue.toLocaleString("en-IN")}`, 80, yPosition + 18);
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Bookings:`, 120, yPosition + 18);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${invoiceData.totalBookings}`, 170, yPosition + 18);
    
    yPosition += 35;

    // Monthly Breakdown Table
    if (invoiceData.monthlyBreakdown.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Monthly Breakdown", 20, yPosition);
      yPosition += 8;

      // Table Header with background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Month", 25, yPosition);
      pdf.text("Bookings", 80, yPosition);
      pdf.text("Revenue (₹)", 130, yPosition);
      pdf.text("Avg/Booking", 170, yPosition);
      yPosition += 3;

      // Draw line under header
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 5;

      // Table rows
      pdf.setFont("helvetica", "normal");
      let rowCount = 0;
      invoiceData.monthlyBreakdown.forEach((data) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
          // Redraw header on new page
          pdf.setFillColor(240, 240, 240);
          pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
          pdf.setFont("helvetica", "bold");
          pdf.text("Month", 25, yPosition);
          pdf.text("Bookings", 80, yPosition);
          pdf.text("Revenue (₹)", 130, yPosition);
          pdf.text("Avg/Booking", 170, yPosition);
          yPosition += 8;
        }
        
        // Alternate row colors
        if (rowCount % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(20, yPosition - 4, pageWidth - 40, 6, 'F');
        }
        
        const avgBooking = data.bookings > 0 ? (data.revenue / data.bookings) : 0;
        
        pdf.setFont("helvetica", "normal");
        pdf.text(data.month, 25, yPosition);
        pdf.text(data.bookings.toString(), 80, yPosition);
        pdf.text(`₹${data.revenue.toLocaleString("en-IN")}`, 130, yPosition);
        pdf.text(`₹${avgBooking.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, 170, yPosition);
        
        // Draw row separator
        pdf.setDrawColor(230, 230, 230);
        pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
        
        yPosition += 6;
        rowCount++;
      });
      
      // Draw bottom border
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 5;
    }

    // Total Section
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFillColor(245, 245, 245);
    pdf.rect(pageWidth - 80, yPosition, 60, 15, 'F');
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("TOTAL:", pageWidth - 75, yPosition + 7);
    pdf.text(`₹${invoiceData.totalRevenue.toLocaleString("en-IN")}`, pageWidth - 25, yPosition + 7, { align: "right" });
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Bookings: ${invoiceData.totalBookings}`, pageWidth - 75, yPosition + 13);
    
    yPosition += 25;

    // Footer
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = pageHeight - 20;
    } else {
      yPosition = pageHeight - 20;
    }
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition - 5, pageWidth - 20, yPosition - 5);
    
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `This is a computer-generated invoice. Generated on ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    
    pdf.setTextColor(0, 0, 0);

    // Save PDF
    pdf.save(`invoice_${invoiceData.period}_${new Date().getTime()}.pdf`);
    setShowInvoiceDropdown(false);
  };

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
              
              {/* Invoice Download Button */}
              <div className="relative invoice-dropdown-container">
                <button
                  onClick={() => setShowInvoiceDropdown(!showInvoiceDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                
                {showInvoiceDropdown && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => handleDownloadInvoice("monthly")}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Monthly Invoice</p>
                        <p className="text-xs text-gray-500">Current month</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice("yearly")}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm border-t border-gray-100"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Yearly Invoice</p>
                        <p className="text-xs text-gray-500">Full year</p>
                      </div>
                    </button>
                  </div>
                )}
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
                <span className="text-sm font-medium text-gray-700">Total Offerings</span>
                <span className="text-2xl font-bold text-gray-900">{totalOfferings}</span>
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
                <p className="text-xs text-gray-500 mb-1">Most Active Category</p>
                <p className="text-xl font-bold text-gray-900">{getMostActiveCategory()}</p>
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

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
            <p className="text-sm text-gray-600 mb-2 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
            <p className="text-sm text-gray-600 mb-2 font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.bookings}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
            <p className="text-sm text-gray-600 mb-2 font-medium">Growth Rate</p>
            <p className={`text-3xl font-bold flex items-center gap-2 ${isPositiveGrowth
                ? "text-emerald-600"
                : "text-red-600"
              }`}>
              {isPositiveGrowth ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              {isPositiveGrowth ? "+" : ""}{growthPercentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}