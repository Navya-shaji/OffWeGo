import store from "@/store/store";
import axiosInstance from "./instance";
import axios from "axios";
import { setToken, logout as userLogout } from "@/store/slice/user/authSlice";
import { logout as vendorLogout } from "@/store/slice/vendor/authSlice";
export const setInterceptors = () => {
  axiosInstance.interceptors.request.use((config) => {
    const { adminAuth, auth, vendorAuth } = store.getState();

    if (config.headers) {
      if (adminAuth.token) config.headers.Authorization = `Bearer ${adminAuth.token}`;
      else if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
      else if (vendorAuth.token) config.headers.Authorization = `Bearer ${vendorAuth.token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const code = error.response?.data?.code;
      const originalRequest = error.config;

      // Blocked users/vendors
      if (status === 403) {
        if (code === "USER_BLOCKED") {
          store.dispatch(userLogout());
          localStorage.removeItem("id");
          window.location.href = "/userBlockNotice";
        }
        if (code === "VENDOR_BLOCKED") {
          store.dispatch(vendorLogout());
          localStorage.removeItem("id");
          window.location.href = "/vendorBlockNotice";
        }
        return Promise.reject(error);
      }

      // Handle token refresh
      if (
        status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/refresh-token")
      ) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}api/refresh-token`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = response.data.accessToken;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          if (window.location.href.includes("admin")) {
            store.dispatch({ type: "adminAuth/setToken", payload: { token: newAccessToken } });
          } else if (window.location.href.includes("vendor")) {
            store.dispatch({ type: "vendorAuth/setToken", payload: { token: newAccessToken } });
          } else {
            store.dispatch(setToken({ token: newAccessToken }));
          }

          return axiosInstance(originalRequest);
        } catch (err) {
          store.dispatch(userLogout());
          store.dispatch(vendorLogout());
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};
