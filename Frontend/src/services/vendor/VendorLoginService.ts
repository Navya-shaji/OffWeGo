import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const vendorLogin = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/api/vendor/login", { email, password });
    return res.data;
  } catch (error) {
    console.error("Vendor login error:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Vendor login failed");
    }
    throw new Error("An unexpected error occurred during vendor login");
  }
};

