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
      "/profile",
      "/chat",
      "/bookings",
      "/destinations",
      "/articles",
      "/search",
      "/",
    ];

    const isExplicitUserRoute = explicitUserRoutes.some(
      (route) =>
        currentPathLower === route || currentPathLower.startsWith(route + "/")
    );

    const isVendorRoute = currentPathLower.startsWith("/vendor");
    const isAdminRoute = currentPathLower.startsWith("/admin");
    const isUserRoute = !isVendorRoute && !isAdminRoute;

    const finalIsUserRoute = isExplicitUserRoute || isUserRoute;

    if (finalIsUserRoute) {
      console.log("📍📍📍 USER ROUTE DETECTED - FORCING USER authentication");
      console.log("📍 Route:", currentPath, "isUserRoute:", isUserRoute);

      if (state.auth.isAuthenticated && state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error("❌ On user route but no user authentication found!");
        console.error("❌ Available auth:", {
          userAuth: state.auth.isAuthenticated,
          userId: state.auth.user?.id,
          vendorAuth: state.vendorAuth.isAuthenticated,
          vendorId: state.vendorAuth.vendor?.id,
        });
        console.warn(
          "⚠️ Returning empty array - user not authenticated on user route"
        );
        return [];
      }
    } else if (isVendorRoute && !finalIsUserRoute) {
      console.log("📍 VENDOR ROUTE DETECTED - Using VENDOR authentication");
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
        console.log(
          "✅ Identified as VENDOR (vendor route), vendorId:",
          recipientId
        );
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
        console.log(
          "⚠️ Using VENDOR (fallback - vendor route), vendorId:",
          recipientId
        );
      } else {
        console.warn("⚠️ On vendor route but no vendor authentication found");
        return [];
      }
    } else if (isAdminRoute) {
      console.log("ℹ️ Admin route - skipping notification fetch");
      return [];
    } else {
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

    if (finalIsUserRoute && recipientType === "vendor") {
      console.error(
        "❌ This should NEVER happen - forcing switch to USER auth"
      );

      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        return [];
      }
    }

    if (!isVendorRoute && recipientType === "vendor") {
      console.error(
        "❌ Route:",
        currentPath,
        "isVendorRoute:",
        isVendorRoute,
        "RecipientType:",
        recipientType
      );

      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error(" Cannot switch to user - no user auth available");
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

    if (isUserRoute && recipientType === "vendor") {
      console.error(
        "❌❌❌ BLOCKED: Attempted to use vendor auth on USER route!"
      );
      console.error(
        "❌ Route:",
        currentPath,
        "isUserRoute:",
        isUserRoute,
        "RecipientType:",
        recipientType
      );

      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
        console.log("FORCED switch to USER auth, userId:", recipientId);
      } else {
        console.error(
          " Cannot use vendor authentication on user routes - no user auth available"
        );
        return [];
      }
    }

    if (isVendorRoute && recipientType === "user") {
      console.error("❌ BLOCKED: Attempted to use user auth on vendor route!");
      console.error(
        "❌ Route:",
        currentPath,
        "isVendorRoute:",
        isVendorRoute,
        "RecipientType:",
        recipientType
      );

      if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
        console.log("✅ FORCED switch to VENDOR auth, vendorId:", recipientId);
      } else {
        console.error(
          "❌ Cannot use user authentication on vendor routes - no vendor auth available"
        );
        return [];
      }
    }

    if (finalIsUserRoute && recipientType === "vendor") {
      console.error("❌ FORCING switch to user endpoint");
      recipientType = "user";
      recipientId = state.auth.user?.id || recipientId;
    }

    const endpoint =
      recipientType === "vendor"
        ? "/api/vendor/notification/notify"
        : "/api/notification/notify";

    if (finalIsUserRoute && endpoint.includes("/vendor/")) {
      console.error(
        "❌❌❌ CRITICAL: About to call vendor endpoint on user route!"
      );
      console.error("❌ Route:", currentPath, "Endpoint:", endpoint);
      console.error("❌ This should NEVER happen - returning empty array");
      return [];
    }

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

    if (!res || !res.data) {
      console.warn("⚠️ No response data received from notification endpoint");
      return [];
    }

    if (res.data && res.data.data) {
      return Array.isArray(res.data.data) ? res.data.data : [];
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else {
      console.warn(" Unexpected notification response structure:", res.data);
      return [];
    }
  } catch (error) {
    console.error(" Error fetching notifications:", error);
    if (isAxiosError(error)) {
      const errorResponse = error.response;
      const errorMessage =
        errorResponse?.data?.error ||
        errorResponse?.data?.message ||
        error.message ||
        "Failed to fetch notifications";
      const status = errorResponse?.status;
      const endpoint = error.config?.url;

      let requestPayload: { recipientType?: string; recipientId?: string } = {};
      try {
        if (error.config?.data) {
          requestPayload =
            typeof error.config.data === "string"
              ? JSON.parse(error.config.data)
              : error.config.data;
        }
      } catch (e) {
        console.log(e);
      }

      console.error("Error details:", {
        status,
        message: errorMessage,
        endpoint,
        recipientType: requestPayload?.recipientType || "unknown",
        recipientId: requestPayload?.recipientId || "unknown",
        currentPath: window.location.pathname,
      });

      // If 401/403/404, it means wrong token, wrong endpoint, or not found - return empty array instead of throwing
      if (status === 401 || status === 403 || status === 404) {
        console.warn(
          " Authentication/Authorization error (" +
            status +
            ") - returning empty notifications array"
        );
        console.warn(
          " This might mean the user is not authenticated, the token is invalid, or the endpoint doesn't exist"
        );
        return [];
      }

      if (!errorResponse) {
        console.warn(
          " Network error - no response received. Returning empty array."
        );
        return [];
      }

      console.error("API Error:", errorMessage, "Status:", status);
      throw new Error(errorMessage);
    }

    console.error(" Non-axios error:", error);
    console.warn(" Returning empty array due to unexpected error");
    return [];
  }
};

export const ReadNotification = async (id: string): Promise<Notification> => {
  try {
    const state = store.getState();
    const currentPath = window.location.pathname;

    const isVendorRoute = currentPath.startsWith("/vendor");
    let recipientType: "vendor" | "user" = "user";

    if (isVendorRoute) {
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      }
    } else {
      if (state.auth.isAuthenticated && state.auth.user?.id) {
        recipientType = "user";
      } else if (state.auth.user?.id) {
        recipientType = "user";
      }
    }

    if (recipientType === "user" && !state.auth.user?.id) {
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
      }
    }

    const endpoint =
      recipientType === "vendor"
        ? `/api/vendor/notification/read/${id}`
        : `/api/notification/read/${id}`;

    console.log(`📡 Marking notification as read: ${endpoint}`, {
      recipientType,
      currentPath,
    });

    const res = await axiosInstance.patch(endpoint);

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to mark notification as read"
      );
    }
    throw new Error(
      "An unexpected error occurred while marking notification as read"
    );
  }
};
