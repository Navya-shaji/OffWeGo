import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";

export const createWallet = async (
  ownerId: string,
  ownerType: "admin"
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post("/api/admin/wallet", {
      ownerId,
      ownerType,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create wallet");
    }
    throw new Error("An unexpected error occurred while creating wallet");
  }
};

export const getWallet = async (id: string): Promise<IWallet> => {
  try {
    const response = await axiosInstance.get(`/api/admin/wallet/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get wallet");
    }
    throw new Error("An unexpected error occurred while fetching wallet");
  }
};
