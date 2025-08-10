import axiosInstance from "@/axios/instance";
import type { Hotel } from "@/interface/PackageInterface";
import { isAxiosError } from "axios";

export const createHotel = async (data: Hotel) => {
  try {
    const res = await axiosInstance.post("/api/vendor/add-hotel", data);
    return res;
  } catch (error) {
    console.error("Error adding hotel", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add hotel");
    }
    throw new Error("An unexpected error occurred while adding hotel");
  }
};

export const getAllHotel = async () => {
  try {
    const res = await axiosInstance.get("/api/vendor/hotels");
    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add hotel");
    }
    throw new Error("An unexpected error occurred while adding hotel");
  }
};
