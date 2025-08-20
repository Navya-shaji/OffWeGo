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
export const getActivities = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  activities: Activity[];
  totalActivities: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const res = await axiosInstance.get("/api/vendor/activities", {
      params: { page, limit },
    });

    const { activity = [], totalActivities = 0 } = res.data.data;

    if (!Array.isArray(activity)) {
      return {
        activities: [],
        totalActivities: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }

    return {
      activities: activity,
      totalActivities,
      totalPages: Math.ceil(totalActivities / limit),
      currentPage: page,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch activities"
      );
    }
    throw new Error("An unexpected error occurred while fetching activities");
  }
};
export const updateActivity = async (id: string, data: Activity) => {
  try {
    const res = await axiosInstance.put(`/api/vendor/activities/${id}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update activity"
      );
    }
    throw new Error("An unexpected error occurred while updating activity");
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
export const searchActivity = async (query: string): Promise<Activity[]> => {
  try {
    const res = await axiosInstance.get("/api/vendor/activities/search", {
      params: { q: query }
    });

    const activities = res.data?.data?.activity || [];
    return activities;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to search activity"
      );
    }
    throw new Error("An unexpected error occurred while searching activity");
  }
};


