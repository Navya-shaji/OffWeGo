import store from "@/store/store";
import axiosInstance from "./instance";
import {  setToken, logout as userLogout } from "@/store/slice/user/authSlice";
import { logout as vendorLogout } from "@/store/slice/vendor/authSlice";
import axios from "axios";

export const setInterceptors = () => {
  axiosInstance.interceptors.request.use((config) => {
    const Admintoken = store.getState().adminAuth.token;
    const Usertoken = store.getState().auth.token;
    const Vendortoken = store.getState().vendorAuth.token;

    if (Admintoken && config.headers) {
      config.headers.Authorization = `Bearer ${Admintoken}`;
    } else if (Usertoken && config.headers) {
      config.headers.Authorization = `Bearer ${Usertoken}`;
    } else if (Vendortoken && config.headers) {
      config.headers.Authorization = `Bearer ${Vendortoken}`;
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      const originalRequest = error.config;
      if (status === 403 && code == "USER_BLOCKED") {
      
        store.dispatch(userLogout());
        localStorage.removeItem("id");
        window.location.href = "/userBlockNotice";
        return Promise.reject(error);
      }
      if (status === 403 && code == "VENDOR_BLOCKED") {
       

        store.dispatch(vendorLogout());
        localStorage.removeItem("id");
        window.location.href = "/vendorBlockNotice";
        return Promise.reject(error);
      }
      if (status == 401) {
        // const URL = error.config?.URL || "";
        // if (URL.startWith("/admin")) {
        //   store.dispatch(adminLogout());
        //   window.location.href = "/admin/login";
        // } else if (URL.startWith("/vendor")) {
        //   store.dispatch(vendorLogout());
        //   window.location.href = "/vendor/login";
        // } else {
        //   store.dispatch(userLogout());
        //   window.location.href = "/login";
        // }
        // return Promise.reject(error);
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await axiosInstance.post(
              `${import.meta.env.VITE_BASE_URL}api/refresh-token`
            );
            const newAccessToken = response.data.accessToken;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            if(window.location.href.includes('admin')){
              store.dispatch(setToken({token:newAccessToken}))
            }else if(window.location.href.includes('vendor')){
              store.dispatch(setToken({token: newAccessToken}))
            }else{
              store.dispatch(setToken({token: newAccessToken}))
            }
            return axios(originalRequest);
          } catch {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    }
  );
};
