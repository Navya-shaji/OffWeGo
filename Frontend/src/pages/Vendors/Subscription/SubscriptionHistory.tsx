import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  CheckCircle2,
  Sparkles,
  Calendar,
  History,
  Search,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { getVendorSubscriptionHistory, retrySubscriptionPayment } from "@/services/subscription/subscriptionservice";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import VendorNavbar from "@/components/vendor/navbar";
import { toast } from "react-hot-toast";

interface SubscriptionHistory {
  _id: string;
  planName: string;
  amount: number;
  currency?: string;
  duration?: number;
  status: "active" | "expired" | "cancelled" | "pending";
  startDate: string;
  endDate: string;
  transactionId?: string;
  stripeSessionId?: string;
  paymentStatus: "paid" | "pending" | "failed";
  packageLimit: number;
  usedSlots: number;
  features?: string[];
  vendorDetails?: {
    name: string;
    email: string;
  };
}

export default function VendorSubscriptionHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionHistory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 3;

  const [retryingId, setRetryingId] = useState<string | null>(null);

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "active":
        return { variant: "outline" as const, className: "bg-gray-100 text-gray-800 border-gray-300" };
      case "pending":
        return { variant: "outline" as const, className: "bg-gray-50 text-gray-700 border-gray-200" };
      case "expired":
        return { variant: "outline" as const, className: "bg-gray-900 text-white border-gray-800" };
      case "cancelled":
        return { variant: "outline" as const, className: "bg-gray-200 text-gray-600 border-gray-300" };
      default:
        return { variant: "outline" as const, className: "bg-gray-100 text-gray-700 border-gray-300" };
    }
  };

  const fetchHistory = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);

      const currentPage = isLoadMore ? page + 1 : 1;
      const response = await getVendorSubscriptionHistory(searchQuery, activeTab, currentPage, limit);

      let historyData = [];
      const incomingData = response?.data || response?.bookings || [];
      historyData = Array.isArray(incomingData) ? incomingData : [];

      const normalizedData = historyData.map((item: any) => ({
        _id: item._id || item.id || '',
        planName: item.planName || 'Unknown Plan',
        amount: item.amount || 0,
        currency: item.currency || 'INR',
        duration: item.duration || 0,
        status: (item.status || 'unknown').toLowerCase(),
        startDate: item.startDate || new Date().toISOString(),
        endDate: item.endDate || '',
        transactionId: item.transactionId || '',
        stripeSessionId: item.stripeSessionId || '',
        paymentStatus: item.paymentStatus || 'paid',
        packageLimit: item.packageLimit || 0,
        usedSlots: item.usedSlots || 0,
        features: item.features || [],
        vendorDetails: item.vendorDetails || {}
      }));

      if (isLoadMore) {
        setHistory(prev => [...prev, ...normalizedData]);
        setPage(currentPage);
      } else {
        setHistory(normalizedData);
        setPage(1);
      }

      setTotal(response.total || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      if (!isLoadMore) setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleLoadMore = () => {
    fetchHistory(true);
  };

  const handleShowLess = () => {
    setPage(1);
    setHistory(prev => prev.slice(0, limit));
  };

  const hasMore = history.length < total;
  const showingAll = !hasMore && history.length > limit;

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const handleViewDetails = (subscription: SubscriptionHistory) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handleDownloadInvoice = (subscription: SubscriptionHistory) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Premium Invoice Header
    doc.setFillColor(17, 24, 39); // Tailwind gray-900
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("OffWeGo", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE / RECEIPT", pageWidth - 20, 25, { align: "right" });

    // Vendor & Customer Info
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 20, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(subscription.vendorDetails?.name || "Premium Vendor", 20, 68);
    doc.text(subscription.vendorDetails?.email || "", 20, 75);

    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details:", pageWidth - 20, 60, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${subscription.transactionId || subscription._id.slice(-12)}`, pageWidth - 20, 68, { align: "right" });
    doc.text(`Date: ${formatDate(subscription.startDate)}`, pageWidth - 20, 75, { align: "right" });

    // Invoice Table Header
    doc.setFillColor(243, 244, 246); // Tailwind gray-100
    doc.rect(20, 95, pageWidth - 40, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 102);
    doc.text("Status", pageWidth / 2, 102, { align: "center" });
    doc.text("Total", pageWidth - 25, 102, { align: "right" });

    // Table content
    doc.setFont("helvetica", "normal");
    doc.text(`Subscription Plan: ${subscription.planName}`, 25, 115);
    doc.text(subscription.status.toUpperCase(), pageWidth / 2, 115, { align: "center" });
    doc.text(`INR ${subscription.amount.toLocaleString()}`, pageWidth - 25, 115, { align: "right" });

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 125, pageWidth - 20, 125);

    // Summary
    doc.setFont("helvetica", "bold");
    doc.text("Final Amount Paid:", pageWidth - 60, 140, { align: "right" });
    doc.setFontSize(14);
    doc.text(`INR ${subscription.amount.toLocaleString()}`, pageWidth - 25, 140, { align: "right" });

    // Features Section
    if (subscription.features && subscription.features.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text("INCLUDED FEATURES:", 20, 160);
      subscription.features.slice(0, 5).forEach((feature, index) => {
        doc.text(`• ${feature}`, 25, 168 + (index * 6));
      });
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    const footerText = "Thank you for partnering with OffWeGo. This is a computer-generated receipt.";
    doc.text(footerText, pageWidth / 2, 280, { align: "center" });

    doc.save(`Invoice_${subscription.planName}_${subscription._id.slice(-6)}.pdf`);
  };

  const handleBackToDashboard = () => {
    navigate("/vendor/profile");
  };

  const handleViewPlans = () => {
    navigate("/vendor/subscriptionplans");
  };



  const handleRetryPayment = async (subscription: SubscriptionHistory) => {
    setRetryingId(subscription._id);
    try {
      const result = await retrySubscriptionPayment(subscription._id);

      // Redirect to payment page or open in new tab
      // Handle both response structures: result.data.checkoutUrl or result.data.data.checkoutUrl
      const checkoutUrl = result.data?.checkoutUrl || result.data?.data?.checkoutUrl;

      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error: unknown) {
      console.error("Error retrying payment:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to retry payment";
      toast.error(errorMessage);
    } finally {
      setRetryingId(null);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 font-['Outfit']">
      <VendorNavbar />
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Payment History
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Track and manage all your subscription transactions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={handleViewPlans}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade Plan
            </button>
          </div>
        </div>


        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by plan name..."
                  className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className={activeTab === "all" ? "bg-gray-900 hover:bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"}
            >
              All
            </Button>
            <Button
              variant={activeTab === "active" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("active")}
              className={activeTab === "active" ? "bg-gray-900 hover:bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"}
            >
              Active
            </Button>
            <Button
              variant={activeTab === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("pending")}
              className={activeTab === "pending" ? "bg-gray-900 hover:bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"}
            >
              Pending
            </Button>
            <Button
              variant={activeTab === "expired" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("expired")}
              className={activeTab === "expired" ? "bg-gray-900 hover:bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"}
            >
              Expired
            </Button>
            <Button
              variant={activeTab === "cancelled" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("cancelled")}
              className={activeTab === "cancelled" ? "bg-gray-900 hover:bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900"}
            >
              Cancelled
            </Button>
          </div>
        </div>

        {loading && history.length === 0 ? (
          <LoadingSkeleton />
        ) : history.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[2rem] p-16 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
              <History className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
              {activeTab === "all"
                ? "You haven't made any subscription purchases yet. Enhance your reach today!"
                : `We couldn't find any ${activeTab} subscriptions in your records.`}
            </p>
            <Button
              onClick={handleViewPlans}
              className="px-8 py-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold"
            >
              Explore Growth Plans
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((subscription) => (
              <div
                key={subscription._id}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge
                        variant={getStatusBadgeProps(subscription.status || "unknown").variant}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${getStatusBadgeProps(subscription.status || "unknown").className}`}
                      >
                        {subscription.status}
                      </Badge>
                      <span className="text-gray-300 flex-shrink-0">•</span>
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                        ID: {subscription.transactionId || subscription._id.slice(-8)}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-6">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                        {subscription.planName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(subscription.startDate)}
                        {subscription.endDate && (
                          <>
                            <span className="mx-1">→</span>
                            {formatDate(subscription.endDate)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-row items-center justify-between lg:justify-end gap-8 bg-gray-50/50 lg:bg-transparent p-4 lg:p-0 rounded-xl">
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-3xl font-black text-gray-900">
                        ₹{(subscription.amount || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-11 h-11 rounded-xl border-gray-200 hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                        onClick={() => handleViewDetails(subscription)}
                        title="View Details"
                      >
                        <Search className="h-4 w-4" />
                      </Button>

                      {subscription.status === "pending" && (
                        <Button
                          size="icon"
                          className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all"
                          onClick={() => handleRetryPayment(subscription)}
                          disabled={retryingId === subscription._id}
                        >
                          {retryingId === subscription._id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {history.length > 0 && (
              <div className="flex justify-center pt-8 pb-12">
                {hasMore ? (
                  <Button
                    onClick={handleLoadMore}
                    className="px-10 py-6 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-gray-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </div>
                    ) : (
                      "Load More History"
                    )}
                  </Button>
                ) : showingAll ? (
                  <Button
                    onClick={handleShowLess}
                    variant="outline"
                    className="px-10 py-6 border-2 border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300"
                  >
                    Show Less
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        )}


        {/* Details Modal */}
        {showDetailsModal && selectedSubscription && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="p-8 border-b border-gray-50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 leading-none">Subscription Details</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Transaction Summary</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetailsModal(false)}
                    className="rounded-full hover:bg-gray-100 text-gray-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Essential Info Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Plan Selected</p>
                      <p className="text-xl font-black text-gray-900">{selectedSubscription.planName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</p>
                      <Badge
                        variant={getStatusBadgeProps(selectedSubscription.status).variant}
                        className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 ${getStatusBadgeProps(selectedSubscription.status).className}`}
                      >
                        {selectedSubscription.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 text-right">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Amount Paid</p>
                      <p className="text-2xl font-black text-gray-900 italic">₹{(selectedSubscription.amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Valid Until</p>
                      <p className="text-sm font-bold text-gray-600">
                        {selectedSubscription.endDate ? formatDate(selectedSubscription.endDate) : 'Ongoing'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Included Details / Features */}
                {selectedSubscription.features && Array.isArray(selectedSubscription.features) && selectedSubscription.features.length > 0 && (
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      Included in your plan
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedSubscription.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadInvoice(selectedSubscription)}
                  className="rounded-xl border-gray-200 font-bold text-gray-600 hover:bg-white hover:text-gray-900 transition-all shadow-sm"
                >
                  Download Invoice
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg transition-all"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
