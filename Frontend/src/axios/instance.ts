import { setToken as setAccessToken, removeToken as removeAccessToken } from "@/store/slice/Token/tokenSlice";
import { setToken as setUserAuthToken, logout as userLogout } from "@/store/slice/user/authSlice";
import { setToken as setVendorAuthToken, logout as vendorLogout } from "@/store/slice/vendor/authSlice";
import { setToken as setAdminAuthToken, logout as adminLogout } from "@/store/slice/Admin/adminAuthSlice";
import store from "@/store/store";
import axios, {  } from "axios";

const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/?$/, "/");

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Determine which token to use based on the endpoint being called
  const url = config.url || '';

  // Never attach Authorization header to refresh-token calls (they should rely on httpOnly cookie)
  if (url.includes('/refresh-token')) {
    return config;
  }

  const isVendorEndpoint = url.includes('/api/vendor/');
  const isAdminEndpoint = url.includes('/api/admin/');
  const isUserEndpoint = !url.includes('/api/vendor/') && !url.includes('/api/admin/');
  const isNotificationEndpoint = url.includes('/notification/notify');
  
  let token: string | null = null;
  const tokenSliceToken = store.getState().token?.accessToken;
  if (tokenSliceToken) {
    token = tokenSliceToken;
  }
  
  // For notification endpoints, accept token from either user or vendor
  if (!token && isNotificationEndpoint) {
    const userToken = store.getState().auth?.token;
    const vendorToken = store.getState().vendorAuth?.token;
    // Try user token first, then vendor, then token slice
    token = userToken || vendorToken || tokenSliceToken;
    console.log("🔑 Notification endpoint - Token selection:", {
      hasUserToken: !!userToken,
      hasVendorToken: !!vendorToken,
      hasTokenSliceToken: !!tokenSliceToken,
      selectedToken: token ? "Found" : "Not found"
    });
  } else if (!token && isVendorEndpoint) {
    // For vendor endpoints, prioritize vendor token
    const vendorToken = store.getState().vendorAuth?.token;
    token = vendorToken || tokenSliceToken;
  } else if (!token && isAdminEndpoint) {
    const adminToken = store.getState().adminAuth?.token;
    token = adminToken || tokenSliceToken;
  } else if (!token && isUserEndpoint) {
    // For user endpoints, prioritize user token
    const userToken = store.getState().auth?.token;
    token = userToken || tokenSliceToken;
  } else {
    // For other endpoints (admin, etc.), use any available token
    const tokenState = store.getState().token?.accessToken;
    const authState = store.getState().auth?.token;
    const vendorToken = store.getState().vendorAuth?.token;
    const adminToken = store.getState().adminAuth?.token;
    token = tokenState || authState || vendorToken || adminToken;
  }
  
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  } else {
    console.warn("⚠️ No token found for request:", url);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err?.config;
    const status = err?.response?.status;
    const message = err?.response?.data?.message;

    if (status === 401 && message === "Unauthorized" && originalRequest && !originalRequest._retry) {
      try {
        originalRequest._retry = true;

        const originalUrl: string = originalRequest?.url || "";
        const refreshUrl = originalUrl.includes("/api/vendor/")
          ? "/api/vendor/refresh-token"
          : originalUrl.includes("/api/admin/")
            ? "/api/admin/refresh-token"
            : "/api/refresh-token";

        const response = await axiosInstance.post(refreshUrl);
        const newAccessToken: string | undefined = response?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Refresh token endpoint did not return accessToken");
        }

        store.dispatch(setAccessToken(newAccessToken));

        const state = store.getState();
        if (state.auth?.isAuthenticated) {
          store.dispatch(setUserAuthToken({ token: newAccessToken }));
        }
        if (state.vendorAuth?.isAuthenticated) {
          store.dispatch(setVendorAuthToken({ token: newAccessToken }));
        }
        if (state.adminAuth?.isAuthenticated) {
          store.dispatch(setAdminAuthToken({ token: newAccessToken }));
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        store.dispatch(removeAccessToken());
        store.dispatch(userLogout());
        store.dispatch(vendorLogout());
        store.dispatch(adminLogout());
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
