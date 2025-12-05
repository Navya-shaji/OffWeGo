import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Subscription } from "@/interface/subscription";

const BASE = "/api/admin/subscriptions";
const CREATE = "/api/admin/create-subscription";

export const addSubscription = async (data: Subscription) => {
  try {
    const res = await axiosInstance.post(CREATE, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add subscription");
    }
    throw new Error("Unexpected error adding subscription");
  }
};

export const getSubscriptions = async () => {
  try {
    const res = await axiosInstance.get(BASE);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch subscriptions");
    }
    throw new Error("Unexpected error fetching subscriptions");
  }
};

export const updateSubscription = async (id: string, data: Subscription) => {
  try {
    const res = await axiosInstance.put(`${BASE}/${id}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update subscription");
    }
    throw new Error("Unexpected error updating subscription");
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${BASE}/${id}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete subscription");
    }
    throw new Error("Unexpected error deleting subscription");
  }
};

export const getAllSubscriptionBookings = async () => {
  try {
    const res = await axiosInstance.get("/api/admin/booked-subscription");
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to fetch subscription bookings"
      );
    }
    throw new Error("Unexpected error fetching subscription bookings");
  }
};
