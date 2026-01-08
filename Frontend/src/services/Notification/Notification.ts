import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import store from "@/store/store";

export interface Notification {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  recipientType: "vendor" | "user";
  recipientId: string;
  createdAt: string;
  read: boolean;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const state = store.getState();
    const currentPath = window.location.pathname;
    


    let recipientType: "vendor" | "user" | null = null;
    let recipientId: string | null = null;

 
    const currentPathLower = currentPath.toLowerCase().trim();
    

    const explicitUserRoutes = [
      '/profile',
      '/chat',
      '/bookings',
      '/destinations',
      '/articles',
      '/buddy-travel',
      '/search',
      '/',
    ];
    
    const isExplicitUserRoute = explicitUserRoutes.some(route => 
      currentPathLower === route || currentPathLower.startsWith(route + '/')
    );
    
    const isVendorRoute = currentPathLower.startsWith('/vendor');
    const isAdminRoute = currentPathLower.startsWith('/admin');
    const isUserRoute = !isVendorRoute && !isAdminRoute;
    
    const finalIsUserRoute = isExplicitUserRoute || isUserRoute;


    if (finalIsUserRoute) {
  
      
      if (state.auth.isAuthenticated && state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
       
      } else if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      
      } else {
        console.error(" On user route but no user authentication found!");
        console.error(" Available auth:", {
          userAuth: state.auth.isAuthenticated,
          userId: state.auth.user?.id,
          vendorAuth: state.vendorAuth.isAuthenticated,
          vendorId: state.vendorAuth.vendor?.id,
        });
        console.warn("⚠️ Returning empty array - user not authenticated on user route");
        return [];
      }
      
     
    }
   
    else if (isVendorRoute && !finalIsUserRoute) {
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
      } else {
        return [];
      }
    }

    else if (isAdminRoute) {
      return [];
    }
    else {
      console.warn("⚠️ Route unclear, defaulting to USER auth");
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error(" Cannot determine route or auth type");
        return [];
      }
    }
    

    if (finalIsUserRoute && recipientType === "vendor") {
      console.error("CRITICAL ERROR: Trying to use vendor auth on USER route!");
      console.error(" Route:", currentPath, "isUserRoute:", isUserRoute, "RecipientType:", recipientType);
      console.error(" This should NEVER happen - forcing switch to USER auth");
      
   
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error(" Cannot switch to user - no user auth available");
        return [];
      }
    }
    
    if (!isVendorRoute && recipientType === "vendor") {
      console.error(" CRITICAL ERROR: Trying to use vendor auth on non-vendor route!");
      console.error(" Route:", currentPath, "isVendorRoute:", isVendorRoute, "RecipientType:", recipientType);
      
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error("Cannot switch to user - no user auth available");
        return [];
      }
    }

    if (!recipientType || !recipientId) {
      console.warn(" No recipient type or ID found for path:", currentPath);
      console.warn(" Auth state:", {
        userAuth: state.auth.isAuthenticated,
        userId: state.auth.user?.id,
        vendorAuth: state.vendorAuth.isAuthenticated,
        vendorId: state.vendorAuth.vendor?.id,
      });
      return [];
    }

  
    if (isUserRoute && recipientType === "vendor") {
      console.error(" BLOCKED: Attempted to use vendor auth on USER route!");
      console.error(" Route:", currentPath, "isUserRoute:", isUserRoute, "RecipientType:", recipientType);
   
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error(" Cannot use vendor authentication on user routes - no user auth available");
        return [];
      }
    }
    
    if (isVendorRoute && recipientType === "user") {
      console.error(" BLOCKED: Attempted to use user auth on vendor route!");
      console.error(" Route:", currentPath, "isVendorRoute:", isVendorRoute, "RecipientType:", recipientType);
      if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
      } else {
        console.error(" Cannot use user authentication on vendor routes - no vendor auth available");
        return [];
      }
    }


    if (finalIsUserRoute && recipientType === "vendor") {
     
      recipientType = "user";
      recipientId = state.auth.user?.id || recipientId;
    }
  
    const endpoint = recipientType === "vendor" 
      ? "/api/vendor/notification/notify"
      : "/api/notification/notify"; 
    
 
    if (finalIsUserRoute && endpoint.includes('/vendor/')) {
   
      return [];
    }
    
    // Get token info for debugging
    const userToken = state.auth?.token;
    const vendorToken = state.vendorAuth?.token;
    const tokenSliceToken = store.getState().token?.accessToken;
    const hasToken = !!(userToken || vendorToken || tokenSliceToken);
    
   
    
    if (!hasToken) {
      console.warn("⚠️ No token available - request may fail with 401");
    }
    
    const res = await axiosInstance.post(endpoint, {
      recipientType,
      recipientId,
    });
   
    // Handle different response structures with proper error checking
    if (!res || !res.data) {
      console.warn("⚠️ No response data received from notification endpoint");
      return [];
    }

    if (res.data && res.data.data) {
      return Array.isArray(res.data.data) ? res.data.data : [];
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn("⚠️ Unexpected notification response structure:", res.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    if (isAxiosError(error)) {
      // Safe access to error.response - handle case where response might be undefined
      const errorResponse = error.response;
      const errorMessage = errorResponse?.data?.error || 
                          errorResponse?.data?.message || 
                          error.message || 
                          "Failed to fetch notifications";
      const status = errorResponse?.status;
      const endpoint = error.config?.url;
      
      // Try to parse the request payload to see what was sent
      let requestPayload: { recipientType?: string; recipientId?: string } = {};
      try {
        if (error.config?.data) {
          requestPayload = typeof error.config.data === 'string' 
            ? JSON.parse(error.config.data) 
            : error.config.data;
        }
      } catch (e) {
        // Ignore parse errors
      }
      
      console.error("Error details:", {
        status,
        message: errorMessage,
        endpoint,
        recipientType: requestPayload?.recipientType || 'unknown',
        recipientId: requestPayload?.recipientId || 'unknown',
        currentPath: window.location.pathname,
      });

      // If 401/403/404, it means wrong token, wrong endpoint, or not found - return empty array instead of throwing
      if (status === 401 || status === 403 || status === 404) {
        console.warn("⚠️ Authentication/Authorization error (" + status + ") - returning empty notifications array");
        console.warn("⚠️ This might mean the user is not authenticated, the token is invalid, or the endpoint doesn't exist");
        return [];
      }
      
      // For network errors (no response), return empty array gracefully
      if (!errorResponse) {
        console.warn("⚠️ Network error - no response received. Returning empty array.");
        return [];
      }
      
      // For other errors, still throw but with more context
      console.error("❌ API Error:", errorMessage, "Status:", status);
      throw new Error(errorMessage);
    }
    // For non-axios errors, return empty array instead of throwing
    // This prevents the UI from showing error messages for unexpected errors
    console.error("❌ Non-axios error:", error);
    console.warn("⚠️ Returning empty array due to unexpected error");
    return [];
  }

 
};

export const ReadNotification = async (
id:string
): Promise<Notification> => {
  try {
    const state = store.getState();
    const currentPath = window.location.pathname;

    const currentPathLower = currentPath.toLowerCase().trim();
    const isVendorRoute = currentPathLower.startsWith('/vendor');
    const isAdminRoute = currentPathLower.startsWith('/admin');
    const isUserRoute = !isVendorRoute && !isAdminRoute;

    // Treat common user routes as user-side, even when vendor auth exists.
    const explicitUserRoutes = [
      '/profile',
      '/chat',
      '/bookings',
      '/destinations',
      '/articles',
      '/buddy-travel',
      '/search',
      '/',
    ];

    const isExplicitUserRoute = explicitUserRoutes.some(route =>
      currentPathLower === route || currentPathLower.startsWith(route + '/')
    );

    const finalIsUserRoute = isExplicitUserRoute || isUserRoute;

    let recipientType: "vendor" | "user" = "user";
    if (finalIsUserRoute) {
      recipientType = "user";
    } else if (isVendorRoute) {
      recipientType = "vendor";
    } else {
      recipientType = "user";
    }

    if (recipientType === 'user' && !state.auth.user?.id) {
      throw new Error('User not authenticated');
    }
    if (recipientType === 'vendor' && !state.vendorAuth.vendor?.id) {
      throw new Error('Vendor not authenticated');
    }
    
    // Use correct endpoint based on user type
    const endpoint = recipientType === "vendor"
      ? `/api/vendor/notification/read/${id}`
      : `/api/notification/read/${id}`;
    
    
    const res = await axiosInstance.patch(endpoint);

    if (res.data && res.data.success) {
      return res.data.data || res.data;
    }
    
    return res.data;
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to mark notification as read";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while marking notification as read");
  }
};
