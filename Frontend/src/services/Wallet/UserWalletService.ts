import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";
import { UserRoutes, USER_ROUTES_BASE } from "@/constants/apiRoutes";

export const createUserWallet = async (
  ownerId: string,
  ownerType: string
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.USER_WALLET}`, {
      ownerId,
      ownerType,
    });

    return response.data.data as IWallet;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create wallet");
    }
    throw new Error("An unexpected error occurred while fetching wallet");
  }
};

export const getUserWallet = async (id: string, config?: any): Promise<IWallet> => {
  try {
    const response = await axiosInstance.get(
      `${USER_ROUTES_BASE}${UserRoutes.GET_USER_WALLET.replace(":userId", id)}`,
      config
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get wallet");
    }
    throw new Error("An unexpected error occurred while fetching wallet");
  }
};

export const walletPayment = async (
  userId: string,
  amount: number,
  description?: string
) => {
  try {
    const res = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.WALLET_PAYMENT}`, {
      userId,
      amount,
      description,
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to process wallet payment"
      );
    }
    throw new Error("An unexpected error occurred while processing payment");
  }
};

export const createBookingWithWallet = async (
  userId: string,
  amount: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookingData: any,
  description?: string
) => {
  try {
    const walletRes = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.WALLET_PAYMENT}`, {
      userId,
      amount,
      description: description || "Booking Payment",
    });

    if (!walletRes.data.success) {
      throw new Error("Wallet payment failed");
    }

    const bookingRes = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.WALLET_BOOKING}`, {
      data: bookingData,
      payment_id: walletRes.data.transactionId,
      paymentStatus: "success",
    });

    return bookingRes.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create booking with wallet"
      );
    }

    throw new Error("Unexpected error while creating wallet booking");
  }
};

