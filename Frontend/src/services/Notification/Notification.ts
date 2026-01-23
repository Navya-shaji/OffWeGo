import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import store from "@/store/store";
import { UserRoutes, VendorRoutes, USER_ROUTES_BASE, VENDOR_ROUTES_BASE } from "@/constants/apiRoutes";

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
      "/buddy-travel",
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
        console.warn(
          " Returning empty array - user not authenticated on user route"
        );
        return [];
      }
    } else if (isVendorRoute && !finalIsUserRoute) {
      if (state.vendorAuth.isAuthenticated && state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
      } else if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
      } else {
        return [];
      }
    } else if (isAdminRoute) {
      return [];
    } else {
      console.warn("Route unclear, defaulting to USER auth");
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
      console.error(
        " Route:",
        currentPath,
        "isUserRoute:",
        isUserRoute,
        "RecipientType:",
        recipientType
      );
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
      console.error(
        " CRITICAL ERROR: Trying to use vendor auth on non-vendor route!"
      );
      console.error(
        " Route:",
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
      console.error(
        " Route:",
        currentPath,
        "isUserRoute:",
        isUserRoute,
        "RecipientType:",
        recipientType
      );

      if (state.auth.user?.id) {
        recipientType = "user";
        recipientId = state.auth.user.id;
      } else {
        console.error(
          " Cannot use vendor authentication on user routes - no user auth available"
        );
        return [];
      }
    }

    if (isVendorRoute && recipientType === "user") {
      console.error(" BLOCKED: Attempted to use user auth on vendor route!");
      console.error(
        " Route:",
        currentPath,
        "isVendorRoute:",
        isVendorRoute,
        "RecipientType:",
        recipientType
      );
      if (state.vendorAuth.vendor?.id) {
        recipientType = "vendor";
        recipientId = state.vendorAuth.vendor.id;
      } else {
        console.error(
          " Cannot use user authentication on vendor routes - no vendor auth available"
        );
        return [];
      }
    }

    if (finalIsUserRoute && recipientType === "vendor") {
      recipientType = "user";
      recipientId = state.auth.user?.id || recipientId;
    }

    const endpoint =
      recipientType === "vendor"
        ? `${VENDOR_ROUTES_BASE}${VendorRoutes.NOTIFY}`
        : `${USER_ROUTES_BASE}${UserRoutes.NOTIFY}`;

    if (finalIsUserRoute && endpoint.includes("/vendor/")) {
      return [];
    }

    // Get token info for debugging
    const userToken = state.auth?.token;
    const vendorToken = state.vendorAuth?.token;
    const tokenSliceToken = store.getState().token?.accessToken;
    const hasToken = !!(userToken || vendorToken || tokenSliceToken);

    if (!hasToken) {
      console.warn(" No token available - request may fail with 401");
    }

    const res = await axiosInstance.post(endpoint, {
      recipientType,
      recipientId,
    }, {
      skipErrorToast: true
    } as any);

    if (!res || !res.data) {
      return [];
    }

    if (res.data && res.data.data) {
      return Array.isArray(res.data.data) ? res.data.data : [];
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
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

      if (status === 401 || status === 403 || status === 404) {
        return [];
      }

      if (!errorResponse) {
        return [];
      }

      throw new Error(errorMessage);
    }

    return [];
  }
};

export const ReadNotification = async (id: string): Promise<Notification> => {
  try {
    const state = store.getState();
    const currentPath = window.location.pathname;

    const currentPathLower = currentPath.toLowerCase().trim();
    const isVendorRoute = currentPathLower.startsWith("/vendor");
    const isAdminRoute = currentPathLower.startsWith("/admin");
    const isUserRoute = !isVendorRoute && !isAdminRoute;

    const explicitUserRoutes = [
      "/profile",
      "/chat",
      "/bookings",
      "/destinations",
      "/articles",
      "/buddy-travel",
      "/search",
      "/",
    ];

    const isExplicitUserRoute = explicitUserRoutes.some(
      (route) =>
        currentPathLower === route || currentPathLower.startsWith(route + "/")
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

    if (recipientType === "user" && !state.auth.user?.id) {
      throw new Error("User not authenticated");
    }
    if (recipientType === "vendor" && !state.vendorAuth.vendor?.id) {
      throw new Error("Vendor not authenticated");
    }

    const endpoint =
      recipientType === "vendor"
        ? `${VENDOR_ROUTES_BASE}${VendorRoutes.READ_NOTIFICATION.replace(":notificationId", id)}`
        : `${USER_ROUTES_BASE}${UserRoutes.READ_NOTIFICATION.replace(":notificationId", id)}`;

    const res = await axiosInstance.patch(endpoint);

    if (res.data && res.data.success) {
      return res.data.data || res.data;
    }

    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    if (isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to mark notification as read";
      throw new Error(errorMessage);
    }
    throw new Error(
      "An unexpected error occurred while marking notification as read"
    );
  }
};
