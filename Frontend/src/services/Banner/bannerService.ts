import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { BannerInterface } from "@/interface/bannerInterface";

export const addBanner = async (data: BannerInterface) => {
  try {
    const res = await axiosInstance.post("/api/admin/create-banner", data);
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
    const res = await axiosInstance.get("/api/admin/banner");
    console.log(res)
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
    
      throw new Error(
        error.response?.data?.error || "Failed to fetch banner"
      );
    }
    throw new Error("An unexpected error occurred while fetching banner");
  }
};
