import axiosInstance from "./instance";
import  store  from "@/store/store"
import { logout } from "@/store/slice/user/authSlice"; 

export const setupUserInterceptor = () => {
  axiosInstance.interceptors.request.use(config => {
    const token = store.getState().auth.user?.token; 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (status === 403 && code === "USER_BLOCKED") {
        store.dispatch(logout());
        localStorage.removeItem("id");
        window.location.href = "/userBlockNotice";
      }

      if (status === 401) {
        store.dispatch(logout());
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};
