import axiosInstance from "@/axios/instance";
import axios from "axios";



export interface SubscriptionBookingPayload {
  vendorId: string;
  planId: string;
  planName: string;
  amount: number;
  date: string;
  time: string;
}

export interface SubscriptionBookingResponse {
  success?: boolean;
  sessionId?: string;
  url?: string;
  checkoutUrl?: string;
  bookingId?: string;
  message?: string;
}

export interface VerifyPaymentPayload {
  sessionId: string;
  vendorId: string;
  planId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    paymentStatus: string;
  };
}

export const createSubscriptionBooking = async (
  payload: SubscriptionBookingPayload
): Promise<SubscriptionBookingResponse> => {
  try {
    const response = await axiosInstance.post(
      '/api/vendor/subscription-booking',
      payload
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        "Failed to create subscription booking"
      );
    }
    throw error;
  }
};

export const verifyPaymentAndCreateBooking = async (
  payload: VerifyPaymentPayload
) => {
  try {
    const response = await axiosInstance.post(
      '/api/vendor/subscription/verify-payment',
      payload
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to verify payment"
      );
    }
    throw error;
  }
};
