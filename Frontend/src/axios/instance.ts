import { setToken } from "@/store/slice/Token/tokenSlice";
import store from "@/store/store";
import axios, { } from "axios";
import { toast } from "react-hot-toast";

import { ERROR_MESSAGES } from "@/constants/messages";

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipErrorToast?: boolean;
    skipServerErrorToast?: boolean;
    retry?: boolean;
  }
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
    skipServerErrorToast?: boolean;
    retry?: boolean;
  }
}


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

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

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
      if (isRefreshing) {
        try {
          const newAccessToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (queueErr) {
          return Promise.reject(queueErr);
        }
      }

      originalRequest.retry = true;
      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          const response = await axiosInstance.post("/api/refresh-token", {}, { skipErrorToast: true });
          const newAccessToken = response.data.accessToken;
          store.dispatch(setToken(newAccessToken));
          return newAccessToken;
        } catch (refreshErr) {
          store.dispatch({ type: "auth/logout" });
          store.dispatch({ type: "vendorAuth/logout" });
          store.dispatch({ type: "adminAuth/logout" });
          store.dispatch({ type: "token/removeToken" });

          if (!originalRequest.skipErrorToast) {
            toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
          }
          throw refreshErr;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    const skipToast = originalRequest?.skipErrorToast;
    const skipServerErrorToast = originalRequest?.skipServerErrorToast;

    if (err.response && !skipToast) {
      const status = err.response.status;
      const errorMessage = err.response.data?.message || err.response.data?.error || ERROR_MESSAGES.UNEXPECTED_ERROR;

      if (status !== 401) {
        if (status === 403) {
          toast.error(ERROR_MESSAGES.PERMISSION_DENIED);
        } else if (status >= 500) {
          if (!skipServerErrorToast) {
            toast.error(ERROR_MESSAGES.SERVER_ERROR);
          }
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
