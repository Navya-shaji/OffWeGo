import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IReview } from "@/interface/reviews";

export const createReviews = async (data: IReview) => {
  try {
    const res = await axiosInstance.post("/api/create-reviews", data);
    console.log("Review response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Review error:", error);
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to add reviews";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while adding review");
  }
};

export const allReviews = async (packageName: string) => {
  try {
    // Use packageName instead of packageId
    const res = await axiosInstance.get(`/api/reviews/${encodeURIComponent(packageName)}`);
    console.log(res.data.data)
    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get reviews");
    }
    throw new Error("An unexpected error occurred while fetching reviews");
  }
};
