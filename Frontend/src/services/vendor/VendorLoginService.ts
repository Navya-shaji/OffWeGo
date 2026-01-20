import axiosInstance from "@/axios/instance";
import { getFcmToken } from "@/Firebase/firebase";
import { isAxiosError } from "axios";
import { VendorRoutes, VENDOR_BASE } from "@/constants/apiRoutes";

export const vendorLogin = async (email: string, password: string) => {
  try {

    const fcmToken = await getFcmToken();

    const res = await axiosInstance.post(`${VENDOR_BASE}${VendorRoutes.LOGIN}`, {
      email,
      password,
      fcmToken: fcmToken || null
    });
    return res.data;

  } catch (error) {

    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Vendor login failed");
    }

    throw new Error("An unexpected error occurred during vendor login");
  }
}


export const forgotPassword = async (email: string) => {
  try {
    const res = await axiosInstance.post(`${VENDOR_BASE}${VendorRoutes.FORGOT_PASSWORD}`, { email });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send reset email");
    }
    throw new Error("An unexpected error occurred");
  }
};
