import axiosInstance from "@/axios/instance";
import axios from "axios";



/** ------------------ Types ------------------ */
export interface SubscriptionBookingPayload {
  vendorId: string;
  planId: string;
  planName: string;
  amount: number;
  date: string;
  time: string;
}

export interface SubscriptionBookingResponse {
  success: boolean;
  sessionId: string;
  url: string;
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
      'api/vendor/subscription-booking',
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await axios.post(
      'api/vendor/subscription/verify-payment',
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
