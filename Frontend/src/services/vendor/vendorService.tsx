import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";  // your axios setup

export const vendorRegister = async (formData: FormData) => {
  try {
    const res = await axiosInstance.post("/vendor/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Vendor registration failed.");
    }
    throw new Error("Unknown error during vendor registration.");
  }
};
