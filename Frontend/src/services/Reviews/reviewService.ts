import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IReview } from "@/interface/reviews";

export const createReviews = async (data: IReview) => {
  try {
    const res = await axiosInstance.post("/api/create-reviews", data);
    console.log(res)
    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add reviews");
    }
    throw new Error("An unexpected error occurred while adding review");
  }
};
