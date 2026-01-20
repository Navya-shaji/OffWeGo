import axiosInstance from "@/axios/instance";
import type { TravelPost } from "@/interface/TravelPost";
import { AdminRoutes, ADMIN_BASE } from "@/constants/apiRoutes";
export const adminLogin = async (email: string, password: string) => {
  const response = await axiosInstance.post(`${ADMIN_BASE}${AdminRoutes.LOGIN}`, {
    email,
    password
  })
  return response.data
}
export const getVendorsByStatus = async (
  status: "pending" | "approved" | "rejected"
) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}${AdminRoutes.GET_VENDOR_BY_STATUS.replace(":status", status)}`);
  return response.data.data; // Backend returns vendors in 'data' field
};


export const getPendingVendors = async () => {
  const response = await axiosInstance.get(`${ADMIN_BASE}/vendors/pending`);
  return response.data.data; // Backend returns vendors in 'data' field
};

export const updateVendorStatus = async (vendorId: string, status: "approved" | "rejected", rejectionReason?: string) => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}${AdminRoutes.ADMIN_VENDOR_APPROVAL.replace(":id", vendorId)}`, {
    status,
    rejectionReason,
  });
  return response.data;
};

export const getTravelPostsByStatus = async (
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<TravelPost[]> => {
  const response = await axiosInstance.get(
    `${ADMIN_BASE}${AdminRoutes.TRAVEL_POSTS_BY_STATUS.replace(":status", status)}`
  );
  const payload = response.data || {};
  return (payload.data as TravelPost[]) ?? [];
};

export const updateTravelPostStatus = async (
  postId: string,
  status: "APPROVED" | "REJECTED",
  rejectedReason?: string
): Promise<TravelPost> => {
  const response = await axiosInstance.patch(
    `${ADMIN_BASE}${AdminRoutes.TRAVEL_POST_STATUS_UPDATE.replace(":id", postId)}`,
    {
      status,
      rejectedReason,
    }
  );
  return response.data?.data ?? response.data;
};
