import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IReview } from "@/interface/reviews";
import { UserRoutes, USER_ROUTES_BASE } from "@/constants/apiRoutes";

export const createReviews = async (data: IReview) => {
  try {
    const res = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.REVIEWS}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to add reviews";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while adding review");
  }
};

export const allReviews = async (packageName: string) => {
  try {
    const res = await axiosInstance.get(`${USER_ROUTES_BASE}${UserRoutes.All_REVIEWS.replace(":packageId", encodeURIComponent(packageName))}`);

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get reviews");
    }
    throw new Error("An unexpected error occurred while fetching reviews");
  }
};
