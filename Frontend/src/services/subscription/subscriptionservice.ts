/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getVendorSubscription = async (vendorId?: string) => {
  try {
    const res = await axiosInstance.get(`/api/vendor/subscription`, {
      params: { vendorId },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch vendor subscription"
      );
    }
    throw new Error("Unexpected error fetching vendor subscription");
  }
};

export const getVendorSubscriptionHistory = async () => {
  try {
    const res = await axiosInstance.get('/api/vendor/subscription/history');
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch subscription history'
      );
    }
    throw new Error('Unexpected error fetching subscription history');
  }
};

export const cancelSubscription = async (bookingId: string) => {
  try {
    const res = await axiosInstance.delete(`/api/vendor/subscription/${bookingId}/cancel`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to cancel subscription'
      );
    }
    throw new Error('Unexpected error cancelling subscription');
  }
};

export const retrySubscriptionPayment = async (bookingId: string) => {
  try {
    const res = await axiosInstance.post(`/api/vendor/subscription/${bookingId}/retry`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to retry payment'
      );
    }
    throw new Error('Unexpected error retrying payment');
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


export const getVendorActiveSubscription = async (vendorId?: string) => {
  try {
    if (!vendorId) {
      throw new Error("Vendor ID is required");
    }

    let res;
    try {
      res = await axiosInstance.get("/api/vendor/subscription");
    } catch (vendorError: any) {
      try {
        res = await axiosInstance.get("/api/admin/booked-subscription");
      } catch (adminError: any) {
        console.error(" Both endpoints failed:", {
          vendorError: vendorError?.response?.status,
          adminError: adminError?.response?.status
        });
        throw adminError;
      }
    }
    
   
    
 
    if (!res || !res.data) {
      console.error(" No response data received from API");
      return {
        success: true,
        vendorSubscription: null,
        hasActiveSubscription: false
      };
    }
    

    if (res.data?.data && !Array.isArray(res.data.data) && res.data.data !== null) {
      const singleSubscription = res.data.data;
      
    
      const now = new Date();
      const endDate = singleSubscription.endDate ? new Date(singleSubscription.endDate) : null;
      const isActive = singleSubscription.status === "active" && 
                       endDate && 
                       endDate >= now;
      
      if (isActive) {
        return {
          success: true,
          vendorSubscription: singleSubscription,
          hasActiveSubscription: true
        };
      } else {
        return {
          success: true,
          vendorSubscription: singleSubscription,
          hasActiveSubscription: false
        };
      }
    }
    
    let subscriptionsArray: any[] = [];
    
    if (res.data?.data && Array.isArray(res.data.data)) {
      subscriptionsArray = res.data.data;
    } else if (Array.isArray(res.data)) {
      subscriptionsArray = res.data;
    } else if (res.data?.subscriptions && Array.isArray(res.data.subscriptions)) {
      subscriptionsArray = res.data.subscriptions;
    } else if (res.data?.bookings && Array.isArray(res.data.bookings)) {
      subscriptionsArray = res.data.bookings;
    } else {
      console.warn(" Unexpected API response structure:", res.data);
      return {
        success: true,
        vendorSubscription: null,
        hasActiveSubscription: false
      };
    }
    
    if (subscriptionsArray.length > 0) {
      const now = new Date();
      

      
      const vendorSubscriptions = subscriptionsArray.filter((sub: any) => {
        const subVendorId = sub.vendorId?.toString() || sub.vendorId;
        const currentVendorId = vendorId.toString();
        const matches = subVendorId === currentVendorId;
    
        return matches;
      });
      
 
  
      const activeSubscription = vendorSubscriptions.find((sub: any) => {
   
        if (sub.status !== "active") {
          return false;
        }
        
        const endDate = sub.endDate ? new Date(sub.endDate) : null;
        if (!endDate) {
          return false; 
        }
        
        const isNotExpired = endDate >= now;
        
        
        
        return isNotExpired;
      });
      
      if (activeSubscription) {
 
        return {
          success: true,
          vendorSubscription: activeSubscription,
          hasActiveSubscription: true
        };
      }
    } else {
      console.log(" Unexpected API response structure:", res.data);
    }
    
    return {
      success: true,
      vendorSubscription: null,
      hasActiveSubscription: false
    };
  } catch (error) {
    
    if (isAxiosError(error)) {
      console.error("API Error Response:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn(" Authentication error - vendor may not be authenticated");
      }
      
      return {
        success: false,
        vendorSubscription: null,
        hasActiveSubscription: false
      };
    }
    
    return {
      success: false,
      vendorSubscription: null,
      hasActiveSubscription: false
    };
  }
};

export const getVendorSubscriptionLegacy = async (vendorId?: string) => {
  try {
    const res = await axiosInstance.get("/api/vendor/subscription");
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      try {
        const res = await axiosInstance.get("/api/admin/booked-subscription");
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