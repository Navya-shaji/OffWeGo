import store from "@/store/store";
import { logout } from "@/store/slice/Admin/adminAuthSlice";  // your admin auth slice
import axiosInstance from "./instance";
export const setupAdminInterceptor = () =>{
axiosInstance.interceptors.request.use((config) => {
    console.log("hai")
const token = store.getState().adminAuth.token;
if (token && config.headers) {
  config.headers.Authorization = `Bearer ${token}`;
}

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      store.dispatch(logout()); 
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);
}