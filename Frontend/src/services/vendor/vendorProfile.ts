import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";
import { VendorRoutes, VENDOR_BASE } from "@/constants/apiRoutes";

export const vendorProfile = async (email: string) => {
  try {
    const res = await axiosInstance.get(`${VENDOR_BASE}${VendorRoutes.PROFILE}`, {
      params: { email },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {

      throw new Error(error.response?.data?.message || "Vendor login failed");
    }
    throw new Error("An unexpected error occurred during vendor login");
  }
};

export const editProfile = async (

  updatedData: {
    name?: string;
    phone?: string;
    profileImage?: string;
    documentUrl?: string;
  }
) => {
  try {
    const res = await axiosInstance.put(`${VENDOR_BASE}${VendorRoutes.PROFILE}`, updatedData);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update vendor profile");
    }
    throw new Error("An unexpected error occurred during profile update");
  }
};