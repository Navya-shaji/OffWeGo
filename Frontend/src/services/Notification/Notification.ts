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
    
    console.log("🔍 Notification fetch - Auth state:", {
      userAuth: state.auth.isAuthenticated,
      userExists: !!state.auth.user?.id,
      vendorAuth: state.vendorAuth.isAuthenticated,
      vendorExists: !!state.vendorAuth.vendor?.id,
      currentPath,
    });

    let recipientType: "vendor" | "user" | null = null;
    let recipientId: string | null = null;

    // ============================================
    // CRITICAL: Route-based detection - Check route FIRST
    // ============================================
    // This is the SOURCE OF TRUTH - route determines auth type, NOT auth state
    // We MUST check the route BEFORE checking any authentication state
    
    // ABSOLUTE CHECK FIRST: Explicitly check for user routes BEFORE vendor routes
    // This prevents any possibility of vendor detection on user routes
    const currentPathLower = currentPath.toLowerCase().trim();
    
    // HARD-CODED USER ROUTES - Check these FIRST
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
    
    // FINAL USER ROUTE CHECK: If explicit user route OR not vendor/admin, it's a user route
    const finalIsUserRoute = isExplicitUserRoute || isUserRoute;
    
    console.log("🔍🔍🔍 ROUTE DETECTION (CRITICAL - CHECKING FIRST):", {
      currentPath,
      currentPathLower,
      pathname: window.location.pathname,
      isExplicitUserRoute: isExplicitUserRoute,
      isVendorRoute: isVendorRoute,
      isAdminRoute: isAdminRoute,
      isUserRoute: isUserRoute,
      finalIsUserRoute: finalIsUserRoute,
      userAuth: state.auth.isAuthenticated,
      userId: state.auth.user?.id,
      vendorAuth: state.vendorAuth.isAuthenticated,
      vendorId: state.vendorAuth.vendor?.id,
    });
    
    // ============================================
    // PRIORITY 1: USER ROUTES - ALWAYS USE USER AUTH
    // ============================================
    // If we're on a USER route, ALWAYS use USER auth - NO EXCEPTIONS
    // This includes: /profile, /chat, /bookings, /, /destinations, etc.
    // CRITICAL: This check MUST happen FIRST, before vendor check
    // Use finalIsUserRoute to ensure we catch all user routes
    // EARLY RETURN: If user route, NEVER check vendor - return immediately after setting user auth
    if (finalIsUserRoute) {
      console.log("📍📍📍 USER ROUTE DETECTED - FORCING USER authentication");
      console.log("📍 Route:", currentPath, "isUserRoute:", isUserRoute);
      
      if (state.auth.isAuthenticated && state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("✅✅✅ Identified as USER (user route) - user authenticated, userId:", recipientId);
        console.log("✅ IGNORING vendor auth completely on user routes");
        // EARLY EXIT: Skip all vendor checks - go directly to API call
        // Don't continue to vendor route check
      } else if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("⚠️ Using USER (fallback - user route) - user exists but not authenticated, userId:", recipientId);
        // EARLY EXIT: Skip all vendor checks
      } else {
        console.error("❌ On user route but no user authentication found!");
        console.error("❌ Available auth:", {
          userAuth: state.auth.isAuthenticated,
          userId: state.auth.user?.id,
          vendorAuth: state.vendorAuth.isAuthenticated,
          vendorId: state.vendorAuth.vendor?.id,
        });
        console.warn("⚠️ Returning empty array - user not authenticated on user route");
        return [];
      }
      
      // SKIP VENDOR CHECK - Go directly to API call section
      // This prevents any possibility of vendor detection on user routes
    }
    // PRIORITY 2: If we're on a VENDOR route, use VENDOR auth
    // NOTE: This should ONLY execute if finalIsUserRoute is FALSE
    else if (isVendorRoute && !finalIsUserRoute) {
      console.log("📍 VENDOR ROUTE DETECTED - Using VENDOR authentication");
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
        console.log("✅ Identified as VENDOR (vendor route), vendorId:", recipientId);
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
        console.log("⚠️ Using VENDOR (fallback - vendor route), vendorId:", recipientId);
      } else {
        console.warn("⚠️ On vendor route but no vendor authentication found");
        return [];
      }
    }
    // PRIORITY 3: Admin routes - skip notifications
    else if (isAdminRoute) {
      console.log("ℹ️ Admin route - skipping notification fetch");
      return [];
    }
    // FALLBACK: Should never reach here, but default to user if route is unclear
    else {
      console.warn("⚠️ Route unclear, defaulting to USER auth");
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("✅ Defaulted to USER, userId:", recipientId);
      } else {
        console.error("❌ Cannot determine route or auth type");
        return [];
      }
    }
    
    // ============================================
    // FINAL SAFETY CHECK: NEVER use vendor auth on user routes
    // ============================================
    // This is a CRITICAL safety check - if we somehow got vendor auth on a user route, fix it
    if (finalIsUserRoute && recipientType === "vendor") {
      console.error("❌❌❌ CRITICAL ERROR: Trying to use vendor auth on USER route!");
      console.error("❌ Route:", currentPath, "isUserRoute:", isUserRoute, "RecipientType:", recipientType);
      console.error("❌ This should NEVER happen - forcing switch to USER auth");
      
      // Force switch to user if available
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("✅✅✅ FORCED switch to USER auth, userId:", recipientId);
      } else {
        console.error("❌ Cannot switch to user - no user auth available");
        return [];
      }
    }
    
    // Additional check: if not on vendor route, never use vendor auth
    if (!isVendorRoute && recipientType === "vendor") {
      console.error("❌❌❌ CRITICAL ERROR: Trying to use vendor auth on non-vendor route!");
      console.error("❌ Route:", currentPath, "isVendorRoute:", isVendorRoute, "RecipientType:", recipientType);
      
      // Force switch to user if available
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("✅✅✅ FORCED switch to USER auth, userId:", recipientId);
      } else {
        console.error("❌ Cannot switch to user - no user auth available");
        return [];
      }
    }

    if (!recipientType || !recipientId) {
      console.warn("⚠️ No recipient type or ID found for path:", currentPath);
      console.warn("⚠️ Auth state:", {
        userAuth: state.auth.isAuthenticated,
        userId: state.auth.user?.id,
        vendorAuth: state.vendorAuth.isAuthenticated,
        vendorId: state.vendorAuth.vendor?.id,
      });
      return [];
    }

    // ============================================
    // ADDITIONAL VALIDATION: Double-check route/auth match
    // ============================================
    // This is a redundant safety check to catch any edge cases
    if (isUserRoute && recipientType === "vendor") {
      console.error("❌❌❌ BLOCKED: Attempted to use vendor auth on USER route!");
      console.error("❌ Route:", currentPath, "isUserRoute:", isUserRoute, "RecipientType:", recipientType);
      // Force switch to user if available
      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("✅✅✅ FORCED switch to USER auth, userId:", recipientId);
      } else {
        console.error("❌ Cannot use vendor authentication on user routes - no user auth available");
        return [];
      }
    }
    
    if (isVendorRoute && recipientType === "user") {
      console.error("❌ BLOCKED: Attempted to use user auth on vendor route!");
      console.error("❌ Route:", currentPath, "isVendorRoute:", isVendorRoute, "RecipientType:", recipientType);
      // Force switch to vendor if available
      if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
        console.log("✅ FORCED switch to VENDOR auth, vendorId:", recipientId);
      } else {
        console.error("❌ Cannot use user authentication on vendor routes - no vendor auth available");
        return [];
      }
    }

    // ============================================
    // FINAL CHECK BEFORE API CALL: Never use vendor endpoint on user routes
    // ============================================
    // This is the LAST safety check - if we're on a user route, FORCE user endpoint
    if (finalIsUserRoute && recipientType === "vendor") {
      console.error("❌❌❌ FINAL CHECK FAILED: About to call vendor endpoint on user route!");
      console.error("❌ FORCING switch to user endpoint");
      recipientType = "user";
      recipientId = state.auth.user?.id || recipientId;
    }
    
    // Use correct endpoint based on user type (AFTER validation)
    // User route: /api/notification/notify (defined in Backend UserRoutes.NOTIFY)
    // Vendor route: /api/vendor/notification/notify
    const endpoint = recipientType === "vendor" 
      ? "/api/vendor/notification/notify"
      : "/api/notification/notify"; // User notification route from userRoute.ts
    
    // FINAL VALIDATION: If we're on a user route, endpoint MUST be user endpoint
    if (finalIsUserRoute && endpoint.includes('/vendor/')) {
      console.error("❌❌❌ CRITICAL: About to call vendor endpoint on user route!");
      console.error("❌ Route:", currentPath, "Endpoint:", endpoint);
      console.error("❌ This should NEVER happen - returning empty array");
      return [];
    }
    
    // Get token info for debugging
    const userToken = state.auth?.token;
    const vendorToken = state.vendorAuth?.token;
    const tokenSliceToken = store.getState().token?.accessToken;
    const hasToken = !!(userToken || vendorToken || tokenSliceToken);
    
    console.log(`📡 Fetching notifications from: ${endpoint}`, { 
      recipientType, 
      recipientId, 
      currentPath,
      isVendorRoute: currentPath.startsWith('/vendor'),
      isUserRoute: !currentPath.startsWith('/vendor') && !currentPath.startsWith('/admin'),
      payload: { recipientType, recipientId },
      userAuth: state.auth.isAuthenticated,
      userId: state.auth.user?.id,
      vendorAuth: state.vendorAuth.isAuthenticated,
      vendorId: state.vendorAuth.vendor?.id,
      hasUserToken: !!userToken,
      hasVendorToken: !!vendorToken,
      hasTokenSliceToken: !!tokenSliceToken,
      hasAnyToken: hasToken,
    });
    
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
    
    // Determine recipient type based on current route context
    const isVendorRoute = currentPath.startsWith('/vendor');
    let recipientType: "vendor" | "user" = "user";
    
    if (isVendorRoute) {
      // On vendor routes - prioritize vendor authentication
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      }
    } else {
      // On user routes - prioritize user authentication
      if (state.auth.isAuthenticated && state.auth.user?.id) {
        recipientType = "user";
      } else if (state.auth.user?.id) {
        recipientType = "user";
      }
    }
    
    // Fallback logic
    if (recipientType === "user" && !state.auth.user?.id) {
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      }
    }
    
    // Use correct endpoint based on user type
    const endpoint = recipientType === "vendor"
      ? `/api/vendor/notification/read/${id}`
      : `/api/notification/read/${id}`;
    
    console.log(`📡 Marking notification as read: ${endpoint}`, { recipientType, currentPath });
    
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
