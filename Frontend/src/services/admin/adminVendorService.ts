import axiosInstance from "@/axios/instance";
import type { Vendor } from "@/interface/vendorInterface";

export const getAllVendors = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  vendors: Vendor[];
  totalvendors: number;
  totalPages: number;
  currentPage: number;
}> => {
  const response = await axiosInstance.get("/api/admin/vendors", {
    params: { page, limit },
  });
  return {
    vendors: response.data.data, // Backend returns vendors in 'data' field
    totalvendors: response.data.totalVendors, // Backend uses 'totalVendors' (camelCase)
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
};

export const updateVendorStatus = async (
  vendorId: string,
  status: "approved" | "blocked"
) => {
  const response = await axiosInstance.patch(
    `/api/admin/vendor/status/${vendorId}`,
    {
      status,
    }
  );
  return response.data;
};

export const updateVendorBlockStatus = async (
  vendorId: string,
  isBlocked: boolean
) => {
  const response = await axiosInstance.patch(
    `/api/admin/vendors/isBlocked/${vendorId}`,
    {
      isBlocked,
    }
  );
  return response.data;
};
export const searchVendor = async (query: string) => {
  const response = await axiosInstance.get("/api/admin/vendors/search", {
    params: { q: query },
  });
  return response.data.data; // Backend returns vendors in 'data' field
};
