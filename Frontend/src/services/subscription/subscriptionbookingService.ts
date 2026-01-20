import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import { VendorRoutes, VENDOR_ROUTES_BASE } from "@/constants/apiRoutes";

const SUBSCRIPTION_BOOKING = `${VENDOR_ROUTES_BASE}${VendorRoutes.SUBSCRIPTION_BOOKING}`;

export interface SubscriptionBookingPayload {
  vendorId: string;
  planId: string;
  date: string;
  time: string;
}

export const createSubscriptionBooking = async (data: SubscriptionBookingPayload) => {
  try {

    const res = await axiosInstance.post(SUBSCRIPTION_BOOKING, data);

    return res.data;
  } catch (error) {

    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to create subscription booking"
      );
    }

    throw new Error("An unexpected error occurred while creating subscription booking");
  }
};

export const verifyPayment = async (paymentData: unknown) => {
  try {
    const res = await axiosInstance.post(`${VENDOR_ROUTES_BASE}${VendorRoutes.VERIFY_PAYMENT}`, paymentData);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Payment verification failed");
    }
    throw new Error("Unexpected error verifying payment");
  }
};