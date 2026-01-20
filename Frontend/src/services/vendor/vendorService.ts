import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { VendorSignupSchema } from "@/Types/vendor/auth/Tsignup";
import type { Vendor } from "@/interface/vendorInterface";
import { VendorRoutes, VENDOR_BASE } from "@/constants/apiRoutes";

export const vendorRegister = async (data: VendorSignupSchema & { document: string }) => {
  try {
    const res = await axiosInstance.post(`${VENDOR_BASE}${VendorRoutes.SIGNUP}`, data);
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
    const res = await axiosInstance.post(`${VENDOR_BASE}${VendorRoutes.VERIFY_OTP}`, {
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

export const getAllVendorsForUsers = async (): Promise<Vendor[]> => {
  try {
    const response = await axiosInstance.get(`${VENDOR_BASE}${VendorRoutes.LIST}`);
    return response.data.vendors || response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch vendors");
    }
    throw new Error("Unknown error while fetching vendors");
  }
};