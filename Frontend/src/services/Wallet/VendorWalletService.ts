import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";

export const createVendorWallet = async (
  ownerId: string,
  ownerType: string
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post("/api/vendor/wallet", {
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

export const getVendorWallet = async (id: string): Promise<IWallet> => {
  try {
    const response = await axiosInstance.get(`/api/vendor/wallet/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get wallet");
    }
    throw new Error("An unexpected error occurred while fetching wallet");
  }
};
