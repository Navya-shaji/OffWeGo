
import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import store from "@/store/store";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  recipientType: "vendor" | "user";
  recipientId: string;
  createdAt: string;
  read?: boolean;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const state = store.getState();
    console.log(state,"state")

    let recipientType: "vendor" | "user" | null = null;
    let recipientId: string | null = null;

    if (state.vendorAuth.vendor?.id) {
      recipientType = "vendor";
      recipientId = state.vendorAuth.vendor.id;
    } else if (state.auth.user?.id) {
      recipientType = "user";
      recipientId = state.auth.user.id;
    }

    if (!recipientType || !recipientId) {
      return []; 
    }

    const res = await axiosInstance.post(
      `/api/notification/notify`,
      {
        recipientType,
        recipientId,
      }
    );
console.log(res,"data")
    return res.data.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch notifications"
      );
    }
    throw new Error("An unexpected error occurred while fetching notifications");
  }
};
