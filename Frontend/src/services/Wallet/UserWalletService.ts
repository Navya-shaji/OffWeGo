import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";

export const createUserWallet = async (
  ownerId: string,
  ownerType: string
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post("/api/wallet", {
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

export const getUserWallet = async (id: string): Promise<IWallet> => {
  try {
    const response = await axiosInstance.get(`/api/wallet/${id}`);
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
    const res = await axiosInstance.post("/api/wallet/payment", {
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