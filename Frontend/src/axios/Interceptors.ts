import store from "@/store/store";
import axiosInstance from "./instance";
import axios from "axios";
import { setToken, logout as userLogout } from "@/store/slice/user/authSlice";
import { logout as vendorLogout } from "@/store/slice/vendor/authSlice";

export const setInterceptors = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use((config) => {
    const adminToken = store.getState().adminAuth.token;
    const userToken = store.getState().auth.token;
    const vendorToken = store.getState().vendorAuth.token;

    if (config.headers) {
      if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
      else if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
      else if (vendorToken) config.headers.Authorization = `Bearer ${vendorToken}`;
    }

    return config;
  });

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const code = error.response?.data?.code;
      const originalRequest = error.config;

      // Handle blocked users
      if (status === 403) {
        if (code === "USER_BLOCKED") {
          store.dispatch(userLogout());
          localStorage.removeItem("id");
          window.location.href = "/userBlockNotice";
          return Promise.reject(error);
        }
        if (code === "VENDOR_BLOCKED") {
          store.dispatch(vendorLogout());
          localStorage.removeItem("id");
          window.location.href = "/vendorBlockNotice";
          return Promise.reject(error);
        }
      }

      // Handle 401 Unauthorized
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Use axios directly to avoid interceptor loop
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}api/refresh-token`,
            {},
            { withCredentials: true } // send cookies if using refresh token cookie
          );
          const newAccessToken = response.data.accessToken;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Update Redux token depending on role
          if (window.location.href.includes("admin")) {
            store.dispatch(setToken({ token: newAccessToken }));
          } else if (window.location.href.includes("vendor")) {
            store.dispatch(setToken({ token: newAccessToken }));
          } else {
            store.dispatch(setToken({ token: newAccessToken }));
          }

          return axios(originalRequest); // retry original request
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
