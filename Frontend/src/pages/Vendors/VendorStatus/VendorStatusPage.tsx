import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, RefreshCw, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

interface VendorStatusData {
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  name: string;
  email: string;
  submittedAt: string;
}

import axiosInstance from "@/axios/instance";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout as vendorLogoutAction } from "@/store/slice/vendor/authSlice";

export default function VendorStatusPage() {
  const dispatch = useAppDispatch();
  const vendor = useAppSelector((state) => state.vendorAuth.vendor);
  const [statusData, setStatusData] = useState<VendorStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorStatus = async () => {
      try {
        const email = vendor?.email;

        if (!email) {
          // If not in redux, try localStorage as fallback
          const vendorDataStr = localStorage.getItem("vendorData");
          const vendorDataObj = vendorDataStr ? JSON.parse(vendorDataStr) : null;
          const fallbackEmail = vendorDataObj?.email;

          if (!fallbackEmail) {
            setLoading(false);
            return;
          }
          await fetchStatusByEmail(fallbackEmail);
        } else {
          await fetchStatusByEmail(email);
        }
      } catch (error) {
        console.error("Error fetching vendor status:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchStatusByEmail = async (email: string) => {
      const response = await axiosInstance.get(`/api/vendor/status?email=${email}`);
      if (response.data.success) {
        console.log("Vendor Status Data from API:", response.data);
        setStatusData(response.data);
      } else {
        toast.error("Failed to fetch status");
      }
    };

    fetchVendorStatus();
  }, [vendor]);

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
  };

  const handleLogout = () => {
    dispatch(vendorLogoutAction());
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");
    window.location.href = "/vendor/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your status...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (statusData?.status) {
      case "approved":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "rejected":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "pending":
        return <Clock className="w-16 h-16 text-amber-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (statusData?.status) {
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "pending":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusTitle = () => {
    switch (statusData?.status) {
      case "approved":
        return "Congratulations! Your Account is Approved";
      case "rejected":
        return "Your Application Was Rejected";
      case "pending":
        return "Your Application is Under Review";
      default:
        return "Status Unknown";
    }
  };

  const getStatusMessage = () => {
    switch (statusData?.status) {
      case "approved":
        return "You can now start listing your travel packages and manage your business.";
      case "rejected":
        return "We're sorry, but your application could not be approved at this time.";
      case "pending":
        return "Our team is reviewing your application. This usually takes 2-3 business days.";
      default:
        return "Please contact support for more information.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/vendor/login" className="flex items-center">
            <img src="/images/logo.png" alt="OffWeGo" className="h-10 w-auto" />
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className={`rounded-2xl border-2 p-8 ${getStatusColor()}`}>
          {/* Status Icon and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {getStatusTitle()}
            </h1>

            <p className="text-gray-600 text-lg">
              {getStatusMessage()}
            </p>
          </div>

          {/* Vendor Details */}
          {statusData && (
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Application Details</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium">{statusData.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{statusData.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">
                    {new Date(statusData.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Current Status:</span>
                  <span className={`font-medium capitalize ${statusData.status === 'approved' ? 'text-green-600' :
                    statusData.status === 'rejected' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>
                    {statusData.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {statusData?.status === "rejected" && statusData.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">Reason for Rejection</h3>
              <p className="text-red-700">{statusData.rejectionReason}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {statusData?.status === "approved" && (
              <>
                <Link
                  to="/vendor/profile"
                  className="bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-center"
                >
                  Go to Dashboard
                </Link>

                <Link
                  to="/vendor/subscriptionplans"
                  className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
                >
                  Choose Subscription Plan
                </Link>
              </>
            )}

            {statusData?.status === "rejected" && (
              <>
                <Link
                  to="/vendor/signup"
                  className="bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-center"
                >
                  Apply Again
                </Link>
              </>
            )}

            {statusData?.status === "pending" && (
              <>
                <button
                  onClick={handleRefresh}
                  className="bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  Check Status Again
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center"
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
