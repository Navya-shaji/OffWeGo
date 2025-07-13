import axiosInstance from "@/axios/instance";
import type { Vendor } from "@/interface/vendorInterface";

export const getAllVendors = async (): Promise<Vendor[]> => {
  const response = await axiosInstance.get("/admin/vendors");
  return response.data.vendors;
};


export const updateVendorStatus = async (
  vendorId: string,
  status: "approved" | "blocked"
) => {
  const response = await axiosInstance.patch(`/admin/vendor/status/${vendorId}`, {
    status,
  });
  return response.data;
};



export const updateVendorBlockStatus = async (
  vendorId: string,
  isBlocked: boolean
) => {
  const response = await axiosInstance.patch(`/admin/vendors/isBlocked/${vendorId}`, {
    isBlocked,
  });
  return response.data;
};
