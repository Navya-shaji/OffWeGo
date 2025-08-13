import axiosInstance from "@/axios/instance";
import type { Activity } from "@/interface/PackageInterface";
import { isAxiosError } from "axios";

export const createActivity = async (data: Activity) => {
  try {
    const res = await axiosInstance.post("/api/vendor/add-activity", data);
    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add activity");
    }
    throw new Error("An unexpected error occurred while adding activity");
  }
};

export const getActivities = async () => {
  try {
    const res = await axiosInstance.get("/api/vendor/activities");
    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch activity"
      );
    }
    throw new Error("An unexpected error occurred while fetching  activity");
  }
};
export const updateActivity = async (id: string, data: Activity) => {
  try {
    const res = await axiosInstance.put(`/api/vendor/activities/${id}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update destination"
      );
    }
    throw new Error("An unexpected error occurred while updating destination");
  }
};

export const deleteActivity = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`api/vendor/activities/${id}`);

    return response.data.data;
  } catch (error) {
    console.error("Error inside delete activity", error);
    throw error;
  }
};
