import axiosInstance from "@/axios/instance";
import type { Activity } from "@/interface/PackageInterface";
import { isAxiosError } from "axios";
import { VendorRoutes, VENDOR_ROUTES_BASE } from "@/constants/apiRoutes";

export const createActivity = async (data: Activity, destinationId: string) => {
  try {
    const res = await axiosInstance.post(`${VENDOR_ROUTES_BASE}${VendorRoutes.CREATE_ACTIVITY.replace(":packageId", destinationId)}`, data);
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
    const res = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.ACTIVITIES}`, {
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
    const res = await axiosInstance.put(`${VENDOR_ROUTES_BASE}${VendorRoutes.EDIT_ACTIVITY.replace(":activityId", id)}`, data);
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
    const response = await axiosInstance.delete(`${VENDOR_ROUTES_BASE}${VendorRoutes.DELETE_ACTIVITY.replace(":activityId", id)}`);

    return response.data.data;
  } catch (error) {
    console.error("Error inside delete activity", error);
    throw error;
  }
};

export const searchActivity = async (query: string) => {
  try {
    const res = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.SEARCH_ACTIVITY}`, {
      params: { q: query },
    });

    return res.data.data;
  } catch (err) {
    console.error("Search failed:", err);
    return { activities: [], totalPages: 1, totalActivities: 0 };
  }
};
