import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { BannerInterface } from "@/interface/bannerInterface";
import { AdminRoutes, ADMIN_ROUTES_BASE } from "@/constants/apiRoutes";

export const addBanner = async (data: BannerInterface) => {
  try {
    const res = await axiosInstance.post(`${ADMIN_ROUTES_BASE}${AdminRoutes.CREATE_BANNER}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add Banner");
    } else {
      throw new Error("An unexpected error while creating banner");
    }
  }
};

export const getBanner = async () => {
  try {
    const res = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.GET_ALL_BANNERS}`);

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch banner");
    }
    throw new Error("An unexpected error occurred while fetching banner");
  }
};

export const actionBannerupdate = async (id: string, action: boolean) => {
  try {
    const res = await axiosInstance.patch(`${ADMIN_ROUTES_BASE}${AdminRoutes.EDIT_BANNER.replace(":bannerId", id)}`, {
      action,
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update actions"
      );
    }
    throw new Error("An unexpected error occurred while updating actions");
  }
};

export const BannerDelete = async (id: string) => {
  try {
    const result = await axiosInstance.delete(`${ADMIN_ROUTES_BASE}${AdminRoutes.DELETE_BANNER.replace(":bannerId", id)}`);
    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete banner");
    }
    throw new Error("An unexpected error occurred while delete banner");
  }
};
