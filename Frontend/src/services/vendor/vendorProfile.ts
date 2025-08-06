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

export const editProfile = async (
  id: string,
  updatedData: {
    name?: string;
    phone?: string;
    profileImage?: string;
    documentUrl?: string;
  }
) => {
  try {
    const res = await axiosInstance.put(`/vendor/profile/${id}`, updatedData);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to update vendor profile");
    }
    throw new Error("An unexpected error occurred during profile update");
  }
};