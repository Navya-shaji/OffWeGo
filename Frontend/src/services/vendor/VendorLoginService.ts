import axiosInstance from "@/axios/instance";
import { getFcmToken } from "@/Firebase/firebase";
import { isAxiosError } from "axios";

export const vendorLogin = async (email: string, password: string) => {
  try {
    
    const fcmToken = await getFcmToken();

    const res = await axiosInstance.post("/api/vendor/login", { 
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
};
