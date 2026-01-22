import { setToken } from "@/store/slice/Token/tokenSlice";
import store from "@/store/store";
import axios, { } from "axios";
import { toast } from "react-hot-toast";

import { ERROR_MESSAGES } from "@/constants/messages";

const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/?$/, "/");

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().token.accessToken;
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response &&
      err.response.status === 401 &&
      err.response.data?.message === ERROR_MESSAGES.UNAUTHORIZED &&
      !originalRequest.retry
    ) {
      try {
        originalRequest.retry = true;
        const response = await axiosInstance.post("/api/refresh-token");
        const newAccessToken = response.data.accessToken;
        store.dispatch(setToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        store.dispatch({ type: "token/removeToken" });
        toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
        return Promise.reject(refreshErr);
      }
    }

    // Check if this request should skip error toasts
    const skipToast = originalRequest?.skipErrorToast;

    if (err.response && !skipToast) {
      const status = err.response.status;
      const errorMessage = err.response.data?.message || err.response.data?.error || ERROR_MESSAGES.UNEXPECTED_ERROR;

      if (status !== 401) {
        if (status === 403) {
          toast.error(ERROR_MESSAGES.PERMISSION_DENIED);
        } else if (status >= 500) {
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
        } else {
          toast.error(errorMessage);
        }
      }
    } else if (!skipToast) {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
