import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, History, Search, Filter, ArrowLeft } from "lucide-react";
import { getVendorSubscriptionHistory } from "@/services/subscription/subscriptionservice";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VendorNavbar from "@/components/vendor/navbar";

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
  const [sortBy, setSortBy] = useState("date");
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionHistory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchHistory = async () => {
    try {
      console.log("🔍 Fetching vendor subscription history...");
      const response = await getVendorSubscriptionHistory();
      console.log("📦 Raw API response:", response);
      console.log("📦 Response data:", response?.data);
      console.log("📦 Response structure:", {
        hasData: !!response?.data,
        dataIsArray: Array.isArray(response?.data),
        dataLength: response?.data?.length,
        responseDataKeys: response?.data ? Object.keys(response.data) : 'no data'
      });
      
      // Handle different response structures
      let historyData = [];
      
      if (response?.data && Array.isArray(response.data)) {
        historyData = response.data;
        console.log("✅ Using response.data as array");
      } else if (response?.subscriptions && Array.isArray(response.subscriptions)) {
        historyData = response.subscriptions;
        console.log("✅ Using response.subscriptions as array");
      } else if (response?.bookings && Array.isArray(response.bookings)) {
        historyData = response.bookings;
        console.log("✅ Using response.bookings as array");
      } else if (response?.history && Array.isArray(response.history)) {
        historyData = response.history;
        console.log("✅ Using response.history as array");
      } else if (Array.isArray(response)) {
        historyData = response;
        console.log("✅ Using response as array");
      } else {
        console.warn("⚠️ Unexpected response structure:", response);
        historyData = [];
      }
      
      // Log detailed information about each subscription item
      if (historyData.length > 0) {
        console.log("📊 Sample subscription data structure:");
        console.log("📊 First subscription item:", historyData[0]);
        console.log("📊 Available fields in first item:", Object.keys(historyData[0] || {}));
        
        // Check for common field name variations
        const firstItem = historyData[0];
        console.log("🔍 Field mapping check:");
        console.log("  - planName:", firstItem.planName || firstItem.name || firstItem.plan_name || firstItem.subscriptionName || 'missing');
        console.log("  - amount:", firstItem.amount || firstItem.price || firstItem.total || 'missing');
        console.log("  - status:", firstItem.status || firstItem.subscriptionStatus || firstItem.plan_status || 'missing');
        console.log("  - startDate:", firstItem.startDate || firstItem.start_date || firstItem.createdAt || firstItem.created_at || 'missing');
        console.log("  - endDate:", firstItem.endDate || firstItem.end_date || firstItem.expiresAt || firstItem.expires_at || 'missing');
        console.log("  - duration:", firstItem.duration || firstItem.plan_duration || firstItem.validity || 'missing');
        console.log("  - packageLimit:", firstItem.packageLimit || firstItem.limit || firstItem.max_packages || firstItem.package_limit || 'missing');
        console.log("  - usedSlots:", firstItem.usedSlots || firstItem.used || firstItem.booked || firstItem.used_packages || firstItem.used_count || 'missing');
        console.log("  - features:", firstItem.features || firstItem.plan_features || firstItem.benefits || 'missing');
        console.log("  - paymentStatus:", firstItem.paymentStatus || firstItem.payment_status || firstItem.paymentState || 'missing');
        console.log("  - transactionId:", firstItem.transactionId || firstItem.transaction_id || firstItem.paymentId || firstItem.payment_id || 'missing');
      }
      
      // Normalize the data to match our interface
      const normalizedData = historyData.map((item: any) => {
        const normalized: SubscriptionHistory = {
          _id: item._id || item.id || item.subscriptionId || '',
          planName: item.planName || item.name || item.plan_name || item.subscriptionName || 'Unknown Plan',
          amount: item.amount || item.price || item.total || 0,
          currency: item.currency || item.currency_code || 'USD',
          duration: item.duration || item.plan_duration || item.validity || undefined,
          status: item.status || item.subscriptionStatus || item.plan_status || 'unknown',
          startDate: item.startDate || item.start_date || item.createdAt || item.created_at || new Date().toISOString(),
          endDate: item.endDate || item.end_date || item.expiresAt || item.expires_at || '',
          transactionId: item.transactionId || item.transaction_id || item.paymentId || item.payment_id || '',
          stripeSessionId: item.stripeSessionId || item.stripe_session_id || item.sessionId || '',
          paymentStatus: item.paymentStatus || item.payment_status || item.paymentState || 'unknown',
          packageLimit: item.packageLimit || item.limit || item.max_packages || item.package_limit || 0,
          usedSlots: item.usedSlots || item.used || item.booked || item.used_packages || item.used_count || 0,
          features: item.features || item.plan_features || item.benefits || [],
          vendorDetails: item.vendorDetails || item.vendor || {}
        };
        
        console.log("🔄 Normalized item:", normalized);
        return normalized;
      });
      
      console.log("📊 Final normalized history data:", normalizedData);
      console.log("📊 Normalized data length:", normalizedData.length);
      
      setHistory(normalizedData);
    } catch (error) {
      console.error("❌ Error fetching subscription history:", error);
      console.error("❌ Failed to load subscription history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "cancelled":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

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

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  const filteredAndSortedHistory = history
    .filter(sub => {
      if (!sub) return false;
      
      const matchesTab = activeTab === "all" || sub.status === activeTab;
      const matchesSearch = searchQuery === "" || 
        (sub.planName && sub.planName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sub.transactionId && sub.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      // Handle null/undefined values safely
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case "date":
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        case "name":
          const nameA = a.planName || "";
          const nameB = b.planName || "";
          return nameA.localeCompare(nameB);
        case "amount":
          return (b.amount || 0) - (a.amount || 0);
        case "status":
          const statusA = a.status || "";
          const statusB = b.status || "";
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      console.warn("Invalid date format:", dateString);
      return "Invalid Date";
    }
  };

  const handleViewDetails = (subscription: SubscriptionHistory) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handleDownloadInvoice = (subscription: SubscriptionHistory) => {
    // Create invoice data
    const invoiceData = {
      subscriptionId: subscription._id,
      planName: subscription.planName,
      amount: subscription.amount,
      currency: subscription.currency || 'USD',
      date: subscription.startDate,
      status: subscription.status,
      transactionId: subscription.transactionId,
      vendorDetails: subscription.vendorDetails
    };

    // Generate and download invoice as JSON (in a real app, this would be PDF)
    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `invoice_${subscription.planName}_${subscription._id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBackToDashboard = () => {
    navigate("/vendor/profile");
  };

  const handleViewPlans = () => {
    navigate("/vendor/subscriptionplans");
  };

  const handleManageSubscription = (subscription: SubscriptionHistory) => {
    navigate(`/vendor/subscriptions/manage/${subscription._id}`);
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
    <div className="min-h-screen bg-white">
      <VendorNavbar />
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <History className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Subscription History</h1>
              <p className="text-gray-500">Track and manage your subscription plans</p>
            </div>
          </div>
        </div>

      {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by plan name or transaction ID..."
                  className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-gray-200 focus:border-gray-400 focus:ring-0">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
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

      {loading ? (
        <LoadingSkeleton />
      ) : filteredAndSortedHistory.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No subscription history found</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "all" 
                ? "You don't have any subscription history yet." 
                : `No ${activeTab} subscriptions found.`}
            </p>
            <Button onClick={handleViewPlans}>
              View Available Plans
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedHistory.map((subscription) => (
            <div 
              key={subscription._id} 
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {subscription.planName || "Unknown Plan"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(subscription.startDate)} —{" "}
                          {subscription.endDate
                            ? formatDate(subscription.endDate)
                            : "Ongoing"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{(subscription.amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <Badge 
                        variant={getStatusBadgeProps(subscription.status || "unknown").variant} 
                        className={`text-xs ${getStatusBadgeProps(subscription.status || "unknown").className}`}
                      >
                        {(subscription.status || "unknown").charAt(0).toUpperCase() + (subscription.status || "unknown").slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {subscription.duration ? `${subscription.duration} days` : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Usage</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {subscription.usedSlots || 0} / {subscription.packageLimit || 0}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gray-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                ((subscription.usedSlots || 0) / Math.max(1, subscription.packageLimit || 1)) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {subscription.features && Array.isArray(subscription.features) && subscription.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {subscription.features.slice(0, 3).map((feature, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {subscription.features.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{subscription.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 lg:ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => handleViewDetails(subscription)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => handleDownloadInvoice(subscription)}
                  >
                    Download Invoice
                  </Button>
                  {subscription.status === "active" && (
                    <Button 
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={() => handleManageSubscription(subscription)}
                    >
                      Manage
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Plan Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Name:</span>
                      <span className="font-medium">{selectedSubscription.planName || "Unknown Plan"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge 
                        variant={getStatusVariant(selectedSubscription.status || "unknown")} 
                        className="text-xs"
                      >
                        {(selectedSubscription.status || "unknown").charAt(0).toUpperCase() + (selectedSubscription.status || "unknown").slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedSubscription.duration ? `${selectedSubscription.duration} days` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{selectedSubscription.currency || '$'}{(selectedSubscription.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <Badge 
                        variant={getPaymentStatusVariant(selectedSubscription.paymentStatus || "unknown")} 
                        className="text-xs"
                      >
                        {selectedSubscription.paymentStatus || "unknown"}
                      </Badge>
                    </div>
                    {selectedSubscription.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium text-sm">{selectedSubscription.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Subscription Period</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(selectedSubscription.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{selectedSubscription.endDate ? formatDate(selectedSubscription.endDate) : 'Ongoing'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Package Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used Slots:</span>
                    <span className="font-medium">{selectedSubscription.usedSlots || 0}/{selectedSubscription.packageLimit || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-700 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((selectedSubscription.usedSlots || 0) / Math.max(1, selectedSubscription.packageLimit || 1)) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {selectedSubscription.features && Array.isArray(selectedSubscription.features) && selectedSubscription.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSubscription.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleDownloadInvoice(selectedSubscription)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Download Invoice
              </Button>
              <Button onClick={() => setShowDetailsModal(false)}>
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
