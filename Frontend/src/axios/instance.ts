import { setToken } from "@/store/slice/Token/tokenSlice";
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
  const isVendorEndpoint = url.includes('/api/vendor/');
  const isUserEndpoint = !url.includes('/api/vendor/') && !url.includes('/api/admin/');
  const isNotificationEndpoint = url.includes('/notification/notify');
  
  let token: string | null = null;
  
  // For notification endpoints, accept token from either user or vendor
  if (isNotificationEndpoint) {
    const userToken = store.getState().auth?.token;
    const vendorToken = store.getState().vendorAuth?.token;
    const tokenSliceToken = store.getState().token?.accessToken;
    // Try user token first, then vendor, then token slice
    token = userToken || vendorToken || tokenSliceToken;
    console.log("🔑 Notification endpoint - Token selection:", {
      hasUserToken: !!userToken,
      hasVendorToken: !!vendorToken,
      hasTokenSliceToken: !!tokenSliceToken,
      selectedToken: token ? "Found" : "Not found"
    });
  } else if (isVendorEndpoint) {
    // For vendor endpoints, prioritize vendor token
    const vendorToken = store.getState().vendorAuth?.token;
    const tokenSliceToken = store.getState().token?.accessToken;
    token = vendorToken || tokenSliceToken;
  } else if (isUserEndpoint) {
    // For user endpoints, prioritize user token
    const userToken = store.getState().auth?.token;
    const tokenSliceToken = store.getState().token?.accessToken;
    token = userToken || tokenSliceToken;
  } else {
    // For other endpoints (admin, etc.), use any available token
    const tokenState = store.getState().token?.accessToken;
    const authState = store.getState().auth?.token;
    const vendorToken = store.getState().vendorAuth?.token;
    token = tokenState || authState || vendorToken;
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
    const originalRequest = err.config;
    if (
      err.response.status === 401 &&
      err.response.data.message === "Unauthorized" &&
      !originalRequest.retry
    ) {
      try {
        originalRequest.retry = true
        const response = await axiosInstance.post("/api/refresh-token");
        store.dispatch(setToken(response.data.accessToken));
        originalRequest.headers.Authorization = `Bearer : ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        store.dispatch({ type: "token/removeToken" });
      }
    }
  }
);

export default axiosInstance;
