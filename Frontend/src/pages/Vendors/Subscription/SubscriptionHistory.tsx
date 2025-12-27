import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, History, CreditCard, Package, Zap, Search, Filter, ArrowLeft } from "lucide-react";
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
  const logo = "/images/logo.png";

  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionHistory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await getVendorSubscriptionHistory();
      setHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      console.error("Failed to load subscription history");
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
        return { variant: "outline" as const, className: "bg-green-50 text-green-700 border-green-200" };
      case "pending":
        return { variant: "outline" as const, className: "bg-amber-50 text-amber-700 border-amber-200" };
      case "expired":
        return { variant: "outline" as const, className: "bg-red-50 text-red-700 border-red-200" };
      case "cancelled":
        return { variant: "outline" as const, className: "bg-gray-50 text-gray-700 border-gray-200" };
      default:
        return { variant: "outline" as const, className: "bg-gray-50 text-gray-700 border-gray-200" };
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
      const matchesTab = activeTab === "all" || sub.status === activeTab;
      const matchesSearch = searchQuery === "" || 
        sub.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "name":
          return a.planName.localeCompare(b.planName);
        case "amount":
          return b.amount - a.amount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM d, yyyy");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <VendorNavbar />
      <div className="max-w-7xl mx-auto p-6 pt-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
                className="bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={logo} 
                    alt="OffWeGo" 
                    className="w-24 h-6"
                  />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Subscription History
                  </h1>
                </div>
                <p className="text-gray-600">Track and manage your subscription plans</p>
              </div>
            </div>
          </div>
        </div>

      {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by plan name or transaction ID..."
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className={activeTab === "all" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-200 hover:bg-gray-50"}
            >
              All
            </Button>
            <Button
              variant={activeTab === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 ${activeTab === "active" ? "bg-green-600 hover:bg-green-700" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Active
            </Button>
            <Button
              variant={activeTab === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 ${activeTab === "pending" ? "bg-amber-600 hover:bg-amber-700" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              Pending
            </Button>
            <Button
              variant={activeTab === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("expired")}
              className={`flex items-center gap-2 ${activeTab === "expired" ? "bg-red-600 hover:bg-red-700" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <div className="h-2 w-2 rounded-full bg-red-500" />
              Expired
            </Button>
            <Button
              variant={activeTab === "cancelled" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("cancelled")}
              className={`flex items-center gap-2 ${activeTab === "cancelled" ? "bg-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <div className="h-2 w-2 rounded-full bg-gray-500" />
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
            <Card 
              key={subscription._id} 
              className="hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md bg-white"
            >
              <div className="md:flex">
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {subscription.planName}
                        </h3>
                        <Badge 
                          variant={getStatusBadgeProps(subscription.status).variant} 
                          className={`text-xs px-3 py-1 ${getStatusBadgeProps(subscription.status).className}`}
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 font-medium">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-gray-700">Valid Period:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDate(subscription.startDate)} —{" "}
                          {subscription.endDate
                            ? formatDate(subscription.endDate)
                            : "Ongoing"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm text-blue-600 font-medium mb-1">Total Amount</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ₹{subscription.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Package Usage</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Package Usage</span>
                          <span className="text-sm font-bold text-blue-600">
                            {subscription.usedSlots} / {subscription.packageLimit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(
                                100,
                                (subscription.usedSlots / subscription.packageLimit) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                                              </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Payment</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Payment Status</span>
                          <Badge 
                            variant={getPaymentStatusVariant(subscription.paymentStatus)}
                            className="text-xs"
                          >
                            {subscription.paymentStatus}
                          </Badge>
                        </div>
                        {subscription.transactionId && (
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-700 mb-1">Transaction ID</span>
                            <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                              {subscription.transactionId}
                            </span>
                          </div>
                        )}
                        {subscription.stripeSessionId && (
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-700 mb-1">Session ID</span>
                            <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                              {subscription.stripeSessionId.substring(0, 8)}...{subscription.stripeSessionId.substring(subscription.stripeSessionId.length - 4)}
                            </span>
                          </div>
                        )}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Payment Method</span>
                          <span className="text-gray-700 font-medium">Stripe</span>
                        </div>
                      </div>
                                              </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Duration</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Duration</span>
                          <span className="text-sm font-bold text-indigo-600">
                            {subscription.duration ? `${subscription.duration} days` : "N/A"}
                          </span>
                        </div>
                        <p className="text-sm">
                          {subscription.status === "active" ? "Expires" : "Expired"}:{" "}
                          <span className="font-medium">
                            {subscription.endDate 
                              ? formatDate(subscription.endDate) 
                              : "N/A"}
                          </span>
                        </p>
                        {subscription.endDate && (
                          <p className="text-sm">
                            Days Left:{" "}
                            <span className="font-medium">
                              {Math.max(
                                0,
                                Math.ceil(
                                  (new Date(subscription.endDate).getTime() - new Date().getTime()) / 
                                  (1000 * 60 * 60 * 24)
                                )
                              )} days
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {subscription.features && subscription.features.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        Plan Features
                      </h4>
                      <div className="space-y-2">
                        {subscription.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg
                                className="h-3 w-3 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l w-full md:w-44 flex-shrink-0 space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-gray-700 hover:bg-white hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all duration-200"
                    onClick={() => handleViewDetails(subscription)}
                  >
                    <Zap className="h-3 w-3 mr-1.5" />
                    Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-gray-700 hover:bg-white hover:text-green-600 hover:border-green-200 border border-transparent transition-all duration-200"
                    onClick={() => handleDownloadInvoice(subscription)}
                  >
                    <CreditCard className="h-3 w-3 mr-1.5" />
                    Invoice
                  </Button>
                  {subscription.status === "active" && (
                    <Button 
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                      onClick={() => handleManageSubscription(subscription)}
                    >
                      <Package className="h-3 w-3 mr-1.5" />
                      Manage
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Plan Name:</span> {selectedSubscription.planName}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge 
                        variant={getStatusVariant(selectedSubscription.status)} 
                        className="ml-2"
                      >
                        {selectedSubscription.status.charAt(0).toUpperCase() + selectedSubscription.status.slice(1)}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Duration:</span> {selectedSubscription.duration ? `${selectedSubscription.duration} days` : 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Amount:</span> {selectedSubscription.currency || '$'}{selectedSubscription.amount.toLocaleString()}</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <Badge 
                        variant={getPaymentStatusVariant(selectedSubscription.paymentStatus)} 
                        className="ml-2"
                      >
                        {selectedSubscription.paymentStatus}
                      </Badge>
                    </p>
                    {selectedSubscription.transactionId && (
                      <p><span className="font-medium">Transaction ID:</span> {selectedSubscription.transactionId}</p>
                    )}
                    {selectedSubscription.stripeSessionId && (
                      <p><span className="font-medium">Session ID:</span> {selectedSubscription.stripeSessionId}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Subscription Period</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Start Date:</span> {formatDate(selectedSubscription.startDate)}</p>
                  <p><span className="font-medium">End Date:</span> {selectedSubscription.endDate ? formatDate(selectedSubscription.endDate) : 'Ongoing'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Package Usage</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Used Slots:</span> {selectedSubscription.usedSlots}/{selectedSubscription.packageLimit}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedSubscription.usedSlots / selectedSubscription.packageLimit) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {selectedSubscription.features && selectedSubscription.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSubscription.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <svg
                          className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedSubscription.vendorDetails && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Vendor Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedSubscription.vendorDetails.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedSubscription.vendorDetails.email}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleDownloadInvoice(selectedSubscription)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
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
