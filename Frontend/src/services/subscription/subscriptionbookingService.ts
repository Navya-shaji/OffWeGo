import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";

const SUBSCRIPTION_BOOKING = "api/vendor/subscription-booking";

export interface SubscriptionBookingPayload {
  vendorId: string;
  planId: string;
  date: string;
  time: string;
}

export const createSubscriptionBooking = async (data: SubscriptionBookingPayload) => {
  try {
    console.log("Creating subscription booking...");

    const res = await axiosInstance.post(SUBSCRIPTION_BOOKING, data);

    console.log("Booking created:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating subscription booking:", error);

    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to create subscription booking"
      );
    }

    throw new Error("An unexpected error occurred while creating subscription booking");
  }
};
