import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import store from "@/store/store";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  recipientType: "vendor" | "user";
  recipientId: string;
  createdAt: string;
  read  : boolean;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const state = store.getState();
    console.log("🔍 Notification fetch - Auth state:", {
      userAuth: state.auth.isAuthenticated,
      userExists: !!state.auth.user?.id,
      vendorAuth: state.vendorAuth.isAuthenticated,
      vendorExists: !!state.vendorAuth.vendor?.id,
    });

    let recipientType: "vendor" | "user" | null = null;
    let recipientId: string | null = null;

    // Prioritize vendor authentication first (to prevent conflicts when both exist)
    if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
      recipientType = "vendor";
      recipientId = state.vendorAuth.vendor.id;
      console.log("✅ Identified as VENDOR");
    } 
    // Then check user authentication
    else if (state.auth.isAuthenticated && state.auth.user?.id) {
      recipientType = "user";
      recipientId = state.auth.user.id;
      console.log("✅ Identified as USER");
    }
    // Fallback: check if vendor exists (even if not authenticated)
    else if (state.vendorAuth.vendor?.id) {
      recipientType = "vendor";
      recipientId = state.vendorAuth.vendor.id;
      console.log("⚠️ Using VENDOR (fallback - not authenticated)");
    }
    // Fallback: check if user exists (even if not authenticated)
    else if (state.auth.user?.id) {
      recipientType = "user";
      recipientId = state.auth.user.id;
      console.log("⚠️ Using USER (fallback - not authenticated)");
    }

    if (!recipientType || !recipientId) {
      console.warn("⚠️ No recipient type or ID found");
      return [];
    }

    // Use correct endpoint based on user type
    const endpoint = recipientType === "vendor" 
      ? "/api/vendor/notification/notify"
      : "/api/notification/notify";
    
    console.log(`📡 Fetching notifications from: ${endpoint}`, { recipientType, recipientId });
    
    const res = await axiosInstance.post(endpoint, {
      recipientType,
      recipientId,
    });
   
    // Handle different response structures
    if (res.data && res.data.data) {
      return Array.isArray(res.data.data) ? res.data.data : [];
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("Unexpected notification response structure:", res.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to fetch notifications";
      console.error("Error details:", {
        status: error.response?.status,
        message: errorMessage,
        endpoint: error.config?.url
      });
      throw new Error(errorMessage);
    }
    throw new Error(
      "An unexpected error occurred while fetching notifications"
    );
  }

 
};

export const ReadNotification = async (
id:string
): Promise<Notification> => {
  try {
    const state = store.getState();
    
    // Check which one is actually authenticated
    let recipientType: "vendor" | "user" = "user";
    if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
      recipientType = "vendor";
    } else if (state.auth.isAuthenticated && state.auth.user?.id) {
      recipientType = "user";
    } else if (state.vendorAuth.vendor?.id) {
      recipientType = "vendor";
    }
    
    // Use correct endpoint based on user type
    const endpoint = recipientType === "vendor"
      ? `/api/vendor/notification/read/${id}`
      : `/api/notification/read/${id}`;
    
    const res = await axiosInstance.patch(endpoint);

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to mark notification as read"
      );
    }
    throw new Error("An unexpected error occurred while marking notification as read");
  }
};
