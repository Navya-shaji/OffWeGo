import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";  
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";

export const vendorRegister = async (data: VendorSignupSchema & { document: string }) => {
  try {
    const res = await axiosInstance.post("/api/vendor/signup", data); 
    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Vendor registration failed.");
    }
    throw new Error("Unknown error during vendor registration.");
  }
};


export const VerifyOtp = async (vendorData: VendorSignupSchema, otp: string) => {
  try {
    const res = await axiosInstance.post("/api/vendor/verify-otp", {
      email: vendorData.email,
      otp,
    });
    return res;
  } catch (error) {
  
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "OTP verification failed");
    }
    throw new Error("Unexpected error while verifying OTP");
  }
};
