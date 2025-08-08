import store from "@/store/store";
import axiosInstance from "./instance";
import { logout as adminLogout } from "@/store/slice/Admin/adminAuthSlice";
import { logout as userLogout } from "@/store/slice/user/authSlice";
import { logout as vendorLogout } from "@/store/slice/vendor/authSlice";

export const setInterceptors = () => {
  console.log("haiii");
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
    (error) => {
      const status = error.response?.status;
      const code = error.response?.data?.code;

      if (status === 403 && code == "USER_BLOCKED") {
        console.log("user blocked");
        store.dispatch(userLogout());
        localStorage.removeItem("id");
        window.location.href = "/userBlockNotice";
        return Promise.reject(error);
      }
      if (status === 403 && code == "VENDOR_BLOCKED") {
        console.log("vendor blocked");

        store.dispatch(vendorLogout());
        localStorage.removeItem("id");
        window.location.href = "/vendorBlockNotice";
        return Promise.reject(error);
      }
      if (status == 401) {
        const URL = error.config?.URL || "";
        if (URL.startWith("/admin")) {
          store.dispatch(adminLogout());
          window.location.href = "/admin/login";
        } else if (URL.startWith("/vendor")) {
          store.dispatch(vendorLogout());
          window.location.href = "/vendor/login";
        } else {
          store.dispatch(userLogout());
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }
  );
};
