import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const vendorProfile = async (email: string) => {
  try {
    const res = await axiosInstance.get("/vendor/profile", {
      params: { email }, 
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data); 
      throw new Error(error.response?.data?.message || "Vendor login failed");
    }
    throw new Error("An unexpected error occurred during vendor login");
  }
};
