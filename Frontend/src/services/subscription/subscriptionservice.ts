import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Subscription } from "@/interface/subscription";

const BASE = "/api/admin/subscriptions";
const CREATE = "/api/admin/create-subscription";

export const addSubscription = async (data: Subscription) => {
  try {
    const res = await axiosInstance.post(CREATE, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add subscription");
    }
    throw new Error("Unexpected error adding subscription");
  }
};

export const getSubscriptions = async () => {
  try {
    const res = await axiosInstance.get(BASE);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch subscriptions");
    }
    throw new Error("Unexpected error fetching subscriptions");
  }
};

export const updateSubscription = async (id: string, data: Subscription) => {
  try {
    const res = await axiosInstance.put(`${BASE}/${id}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update subscription");
    }
    throw new Error("Unexpected error updating subscription");
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${BASE}/${id}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete subscription");
    }
    throw new Error("Unexpected error deleting subscription");
  }
};

export const getAllSubscriptionBookings = async () => {
  try {
    const res = await axiosInstance.get("/api/admin/booked-subscription");
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to fetch subscription bookings"
      );
    }
    throw new Error("Unexpected error fetching subscription bookings");
  }
};

// Get vendor's active subscription booking by vendor ID
// This should return only active, non-expired subscriptions
// Note: Backend should handle expiring old subscriptions via cron job or on-demand
export const getVendorActiveSubscription = async (vendorId?: string) => {
  try {
    if (!vendorId) {
      throw new Error("Vendor ID is required");
    }

    // Try vendor-specific endpoint first
    let res;
    try {
      res = await axiosInstance.get("/api/vendor/subscription");
      console.log("✅ Using vendor-specific endpoint");
    } catch (vendorError: any) {
      // If vendor endpoint fails, fallback to admin endpoint
      console.warn("⚠️ Vendor endpoint failed, trying admin endpoint:", vendorError?.response?.status);
      try {
        res = await axiosInstance.get("/api/admin/booked-subscription");
        console.log("✅ Using admin endpoint as fallback");
      } catch (adminError: any) {
        console.error("❌ Both endpoints failed:", {
          vendorError: vendorError?.response?.status,
          adminError: adminError?.response?.status
        });
        throw adminError;
      }
    }
    
    console.log("📦 Raw API response:", res);
    console.log("📦 Response data:", res?.data);
    console.log("📦 Response status:", res?.status);
    
    // Check if response exists
    if (!res || !res.data) {
      console.error("❌ No response data received from API");
      return {
        success: true,
        vendorSubscription: null,
        hasActiveSubscription: false
      };
    }
    
    // Handle different response structures
    // First check if this is a vendor-specific endpoint response (single subscription object)
    if (res.data?.data && !Array.isArray(res.data.data) && res.data.data !== null) {
      // Vendor endpoint returns { success: true, data: subscription }
      const singleSubscription = res.data.data;
      console.log("✅ Found single subscription from vendor endpoint");
      
      // Validate the subscription
      const now = new Date();
      const endDate = singleSubscription.endDate ? new Date(singleSubscription.endDate) : null;
      const isActive = singleSubscription.status === "active" && 
                       endDate && 
                       endDate >= now;
      
      if (isActive) {
        console.log("✅ Active subscription found from vendor endpoint");
        return {
          success: true,
          vendorSubscription: singleSubscription,
          hasActiveSubscription: true
        };
      } else {
        console.log("❌ Subscription from vendor endpoint is not active or expired");
        return {
          success: true,
          vendorSubscription: singleSubscription,
          hasActiveSubscription: false
        };
      }
    }
    
    // Handle admin endpoint response (array of subscriptions)
    let subscriptionsArray: any[] = [];
    
    if (res.data?.data && Array.isArray(res.data.data)) {
      subscriptionsArray = res.data.data;
      console.log("✅ Found subscriptions in res.data.data (admin endpoint)");
    } else if (Array.isArray(res.data)) {
      subscriptionsArray = res.data;
      console.log("✅ Found subscriptions in res.data (direct array)");
    } else if (res.data?.subscriptions && Array.isArray(res.data.subscriptions)) {
      subscriptionsArray = res.data.subscriptions;
      console.log("✅ Found subscriptions in res.data.subscriptions");
    } else if (res.data?.bookings && Array.isArray(res.data.bookings)) {
      subscriptionsArray = res.data.bookings;
      console.log("✅ Found subscriptions in res.data.bookings");
    } else {
      console.warn("⚠️ Unexpected API response structure:", res.data);
      // Return no active subscription if we can't parse the response
      return {
        success: true,
        vendorSubscription: null,
        hasActiveSubscription: false
      };
    }
    
    if (subscriptionsArray.length > 0) {
      const now = new Date();
      
      console.log(`📊 Total subscriptions in response: ${subscriptionsArray.length}`);
      console.log(`🔍 Looking for vendor ID: ${vendorId} (type: ${typeof vendorId})`);
      
      // First, filter subscriptions for this vendor
      const vendorSubscriptions = subscriptionsArray.filter((sub: any) => {
        const subVendorId = sub.vendorId?.toString() || sub.vendorId;
        const currentVendorId = vendorId.toString();
        const matches = subVendorId === currentVendorId;
        
        if (matches) {
          console.log(`✅ Found matching subscription for vendor:`, {
            subscriptionId: sub._id || sub.id,
            subscriptionVendorId: subVendorId,
            currentVendorId: currentVendorId,
            status: sub.status,
            endDate: sub.endDate
          });
        }
        
        return matches;
      });
      
      console.log(`📋 Found ${vendorSubscriptions.length} subscription(s) for vendor ${vendorId}`);
      
      if (vendorSubscriptions.length > 0) {
        console.log("📋 Vendor subscriptions details:", vendorSubscriptions.map((s: any) => ({
          id: s._id || s.id,
          vendorId: s.vendorId,
          status: s.status,
          endDate: s.endDate,
          startDate: s.startDate
        })));
      }
      
      // Find active subscription that is not expired
      const activeSubscription = vendorSubscriptions.find((sub: any) => {
        // Check status
        if (sub.status !== "active") {
          console.log(`⏭️ Skipping subscription ${sub._id || sub.id} - status is "${sub.status}", not "active"`);
          return false;
        }
        
        // Check if subscription is not expired
        const endDate = sub.endDate ? new Date(sub.endDate) : null;
        if (!endDate) {
          console.log(`⏭️ Skipping subscription ${sub._id || sub.id} - no endDate`);
          return false; // No end date means invalid subscription
        }
        
        // Subscription is active if endDate >= now
        const isNotExpired = endDate >= now;
        
        console.log(`🔍 Checking subscription:`, {
          id: sub._id || sub.id,
          status: sub.status,
          endDate: endDate.toISOString(),
          now: now.toISOString(),
          isNotExpired,
          timeDifference: endDate.getTime() - now.getTime(),
          daysRemaining: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        });
        
        return isNotExpired;
      });
      
      if (activeSubscription) {
        console.log("✅ Found active subscription:", {
          id: activeSubscription._id || activeSubscription.id,
          vendorId: activeSubscription.vendorId,
          status: activeSubscription.status,
          endDate: activeSubscription.endDate
        });
        return {
          success: true,
          vendorSubscription: activeSubscription,
          hasActiveSubscription: true
        };
      } else {
        console.log("❌ No active subscription found. Vendor subscriptions:", vendorSubscriptions.map((s: any) => ({
          id: s._id || s.id,
          status: s.status,
          endDate: s.endDate,
          isExpired: s.endDate ? new Date(s.endDate) < now : true
        })));
      }
    } else {
      console.log("⚠️ Unexpected API response structure:", res.data);
    }
    
    // No active subscription found
    return {
      success: true,
      vendorSubscription: null,
      hasActiveSubscription: false
    };
  } catch (error: any) {
    console.error("❌ Error fetching vendor active subscription:", error);
    
    // Handle axios errors specifically
    if (isAxiosError(error)) {
      console.error("API Error Response:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // If it's a 401/403, the vendor might not be authenticated
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("⚠️ Authentication error - vendor may not be authenticated");
      }
      
      // Return no active subscription instead of throwing
      return {
        success: false,
        vendorSubscription: null,
        hasActiveSubscription: false
      };
    }
    
    // For other errors, return no active subscription
    return {
      success: false,
      vendorSubscription: null,
      hasActiveSubscription: false
    };
  }
};

// Get vendor's own subscription booking by vendor ID (legacy - kept for compatibility)
export const getVendorSubscription = async (vendorId?: string) => {
  try {
    // Try vendor-specific endpoint first
    const res = await axiosInstance.get("/api/vendor/subscription");
    return res.data;
  } catch (error) {
    // Fallback to admin endpoint (might return vendor-specific data based on JWT)
    if (isAxiosError(error) && error.response?.status === 404) {
      try {
        const res = await axiosInstance.get("/api/admin/booked-subscription");
        // Filter for current vendor's subscription if it's an array and vendorId is provided
        if (res.data?.data && Array.isArray(res.data.data) && vendorId) {
          const vendorSubscriptions = res.data.data.filter((sub: any) => {
            const subVendorId = sub.vendorId?.toString() || sub.vendorId;
            return subVendorId === vendorId.toString();
          });
          return {
            ...res.data,
            data: vendorSubscriptions,
            vendorSubscription: vendorSubscriptions.find((sub: any) => 
              sub.status === "active" && 
              sub.endDate && 
              new Date(sub.endDate) > new Date()
            )
          };
        }
        return res.data;
      } catch (fallbackError) {
        if (isAxiosError(fallbackError)) {
          throw new Error(
            fallbackError.response?.data?.message || 
            fallbackError.response?.data?.error || 
            "Failed to fetch vendor subscription"
          );
        }
        throw new Error("Unexpected error fetching vendor subscription");
      }
    }
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to fetch vendor subscription"
      );
    }
    throw new Error("Unexpected error fetching vendor subscription");
  }
};