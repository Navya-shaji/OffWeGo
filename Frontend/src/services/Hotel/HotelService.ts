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

export const updateHotel = async (id: string, data: Hotel) => {
  try {
    const res = await axiosInstance.put(`/api/vendor/hotels/${id}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update hotel"
      );
    }
    throw new Error("An unexpected error occurred while updating hotel");
  }
};

export const deleteHotel = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`api/vendor/hotels/${id}`);

    return response.data.data;
  } catch (error) {
    console.error("Error inside delete hotel", error);
    throw error;
  }
};

export const searchHotel = async (query: string) => {
  const response = await axiosInstance.get("/api/vendor/hotels/search", {
    params: { q: query },
  });
  return response.data.data;
};