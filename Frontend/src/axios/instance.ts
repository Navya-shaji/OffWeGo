import { setToken } from "@/store/slice/Token/tokenSlice";
import store from "@/store/store";
import axios, { } from "axios";

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
      err.response.data?.message === "Unauthorized" &&
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
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
