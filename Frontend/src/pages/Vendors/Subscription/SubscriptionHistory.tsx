import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Calendar, History, Search, ArrowLeft, X, Download, ChevronRight } from "lucide-react";
import { getVendorSubscriptionHistory } from "@/services/subscription/subscriptionservice";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
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
  const [sortBy, ] = useState("date");
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionHistory | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await getVendorSubscriptionHistory();
      
      let historyData = [];
      
      if (response?.data && Array.isArray(response.data)) {
        historyData = response.data;
      } else if (response?.subscriptions && Array.isArray(response.subscriptions)) {
        historyData = response.subscriptions;
      } else if (response?.bookings && Array.isArray(response.bookings)) {
        historyData = response.bookings;
      } else if (response?.history && Array.isArray(response.history)) {
        historyData = response.history;
      } else if (Array.isArray(response)) {
        historyData = response;
      }
      
      const normalizedData = historyData.map((item: any) => ({
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
      }));
      
      setHistory(normalizedData);
    } catch (error) {
      console.error("Error fetching subscription history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case "date":
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        case "name":
          return (a.planName || "").localeCompare(b.planName || "");
        case "amount":
          return (b.amount || 0) - (a.amount || 0);
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleViewDetails = (subscription: SubscriptionHistory) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handleDownloadInvoice = (subscription: SubscriptionHistory) => {
    try {
      // Create a formatted invoice HTML
      const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${subscription.planName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background-color: #f5f5f5;
        }
        .invoice {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-info h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            color: #111827;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-number {
            font-size: 14px;
            color: #6b7280;
            margin: 5px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 10px;
        }
        .status-active { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-expired { background: #e5e7eb; color: #374151; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .details-section {
            margin: 30px 0;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .detail-item {
            margin-bottom: 15px;
        }
        .detail-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .detail-value {
            font-size: 16px;
            color: #111827;
            font-weight: 500;
        }
        .amount-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .amount-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 14px;
            color: #4b5563;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding-top: 15px;
            margin-top: 15px;
            border-top: 2px solid #e5e7eb;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
        }
        .features-section {
            margin: 30px 0;
        }
        .features-title {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 15px;
        }
        .feature-item {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
            color: #4b5563;
        }
        .feature-item:last-child {
            border-bottom: none;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
                background: white;
            }
            .invoice {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="company-info">
                <h1>INVOICE</h1>
                <p style="margin: 5px 0; color: #6b7280;">Subscription Receipt</p>
            </div>
            <div class="invoice-info">
                <div class="invoice-number">Invoice #${subscription._id.slice(-8).toUpperCase()}</div>
                <div class="invoice-number">Date: ${formatDate(subscription.startDate)}</div>
                <span class="status-badge status-${subscription.status}">${subscription.status}</span>
            </div>
        </div>

        ${subscription.vendorDetails?.name || subscription.vendorDetails?.email ? `
        <div class="details-section">
            <div class="detail-label">BILLED TO</div>
            ${subscription.vendorDetails?.name ? `<div class="detail-value">${subscription.vendorDetails.name}</div>` : ''}
            ${subscription.vendorDetails?.email ? `<div style="color: #6b7280; font-size: 14px; margin-top: 5px;">${subscription.vendorDetails.email}</div>` : ''}
        </div>
        ` : ''}

        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-label">Plan Name</div>
                <div class="detail-value">${subscription.planName}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${subscription.duration ? `${subscription.duration} days` : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Subscription Period</div>
                <div class="detail-value">${formatDate(subscription.startDate)} - ${subscription.endDate ? formatDate(subscription.endDate) : 'Ongoing'}</div>
            </div>
            // <div class="detail-item">
            //     <div class="detail-label">Package Limit</div>
            //     <div class="detail-value">${subscription.packageLimit || 0} packages</div>
            // </div>
            ${subscription.transactionId ? `
            <div class="detail-item">
                <div class="detail-label">Transaction ID</div>
                <div class="detail-value" style="font-family: monospace; font-size: 12px;">${subscription.transactionId}</div>
            </div>
            ` : ''}
            <div class="detail-item">
                <div class="detail-label">Payment Status</div>
                <div class="detail-value">${subscription.paymentStatus}</div>
            </div>
        </div>

        <div class="amount-section">
            <div class="amount-row">
                <span>Subscription Plan</span>
                <span>${subscription.planName}</span>
            </div>
            // <div class="amount-row">
            //     <span>Package Limit</span>
            //     <span>${subscription.packageLimit || 0} packages</span>
            // </div>
            <div class="amount-row">
                <span>Used Slots</span>
                <span>${subscription.usedSlots || 0} / ${subscription.packageLimit || 0}</span>
            </div>
            <div class="total-row">
                <span>Total Amount</span>
                <span>${subscription.currency === 'INR' ? '₹' : '$'}${(subscription.amount || 0).toLocaleString()}</span>
            </div>
        </div>

        ${subscription.features && subscription.features.length > 0 ? `
        <div class="features-section">
            <div class="features-title">Plan Features</div>
            ${subscription.features.map(feature => `
                <div class="feature-item">✓ ${feature}</div>
            `).join('')}
        </div>
        ` : ''}

        <div class="footer">
            <p>This is an automatically generated invoice.</p>
            <p>Generated on ${format(new Date(), 'MMM d, yyyy HH:mm')}</p>
        </div>
    </div>
</body>
</html>`;

      // Create a blob and download link
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${subscription.planName.replace(/\s+/g, '_')}_${subscription._id.slice(-8)}.html`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Optional: Show success message
      console.log('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-64" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavbar />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/vendor/profile")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 font-serif text-4xl font-normal tracking-wide text-gray-900">
                Subscription History
              </h1>
              <p className="text-gray-600">Track and manage your subscription plans</p>
            </div>
            <button
              onClick={() => navigate("/vendor/subscriptionplans")}
              className="inline-flex items-center gap-2 rounded border border-gray-900 bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              View Plans
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by plan name or transaction ID..."
                className="w-full rounded border border-gray-300 pl-10 focus:border-gray-400 focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {["all", "active", "pending", "expired", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredAndSortedHistory.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-16 text-center ">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <History className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No subscription history found</h3>
            <p className="mb-6 text-gray-600">
              {activeTab === "all" 
                ? "You don't have any subscription history yet." 
                : `No ${activeTab} subscriptions found.`}
            </p>
            <button
              onClick={() => navigate("/vendor/subscriptionplans")}
              className="inline-flex items-center gap-2 rounded border border-gray-900 bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              View Available Plans
            </button>
          </div>
        ) : (
          <div className="space-y-4 ">
            {filteredAndSortedHistory.map((subscription) => (
              <div 
                key={subscription._id} 
                className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {subscription.planName || "Unknown Plan"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(subscription.startDate)} — {subscription.endDate ? formatDate(subscription.endDate) : "Ongoing"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {subscription.currency === 'INR' ? '₹' : '₹'}{(subscription.amount || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{subscription.currency || 'USD'}</p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="mb-1 text-xs text-gray-500">Status</p>
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(subscription.status || "unknown")}`}>
                          {(subscription.status || "unknown").charAt(0).toUpperCase() + (subscription.status || "unknown").slice(1)}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-900">
                          {subscription.duration ? `${subscription.duration} days` : "N/A"}
                        </p>
                      </div>

                    </div>

        
                    {subscription.features && Array.isArray(subscription.features) && subscription.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                        {subscription.features.slice(0, 3).map((feature, i) => (
                          <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            {feature}
                          </span>
                        ))}
                        {subscription.features.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{subscription.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
                    <button
                      onClick={() => handleViewDetails(subscription)}
                      className="flex-1 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:flex-none lg:w-full"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(subscription)}
                      className="flex items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:w-full"
                      title="Download Invoice"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedSubscription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="font-serif text-xl font-normal tracking-wide text-gray-900">
                  Subscription Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Plan Info */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-500">Plan Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan Name:</span>
                        <span className="font-medium text-gray-900">{selectedSubscription.planName || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(selectedSubscription.status || "unknown")}`}>
                          {(selectedSubscription.status || "unknown").charAt(0).toUpperCase() + (selectedSubscription.status || "unknown").slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">
                          {selectedSubscription.duration ? `${selectedSubscription.duration} days` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Info */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-500">Payment Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-gray-900">
                          {selectedSubscription.currency === 'INR' ? '₹' : '₹'}{(selectedSubscription.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    
                      {selectedSubscription.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="font-mono text-xs font-medium text-gray-900">{selectedSubscription.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Subscription Period */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-500">Subscription Period</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedSubscription.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium text-gray-900">
                        {selectedSubscription.endDate ? formatDate(selectedSubscription.endDate) : 'Ongoing'}
                      </span>
                    </div>
                  </div>
                </div>
         
                {/* Features */}
                {selectedSubscription.features && Array.isArray(selectedSubscription.features) && selectedSubscription.features.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-gray-500">Plan Features</h3>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {selectedSubscription.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
                <button
                  onClick={() => handleDownloadInvoice(selectedSubscription)}
                  className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="rounded border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}