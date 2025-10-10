import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Subscription } from "@/interface/subscription";

export const addSubscription = async (data: Subscription) => {
  try {
    const res = await axiosInstance.post("/api/admin/create-subscription", data);
    return res.data;
  } catch (error) {
    console.error("Error adding subscription", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add subscription");
    }
    throw new Error("An unexpected error occurred while adding subscription");
  }
};

export const getSubscriptions = async () => {
  try {
    const res = await axiosInstance.get("/api/admin/subscriptions");
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch subscriptions");
    }
    throw new Error("An unexpected error occurred while fetching subscriptions");
  }
};

export const updateSubscription = async (id: string, data: Subscription) => {
  try {
    const res = await axiosInstance.put(`/api/admin/subscriptions/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating subscription", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update subscription");
    }
    throw new Error("An unexpected error occurred while updating subscription");
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/admin/subscriptions/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting subscription", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete subscription");
    }
    throw new Error("An unexpected error occurred while deleting subscription");
  }
};
