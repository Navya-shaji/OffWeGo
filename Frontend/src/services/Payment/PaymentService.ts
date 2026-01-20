import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import { UserRoutes, USER_ROUTES_BASE } from "@/constants/apiRoutes";

// ================== USER PAYMENT ==================

export const createPayment = async (amount: number, currency: string) => {
  try {
    const res = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.CREATE_PAYMENT}`, { amount, currency });


    return res.data;
  } catch (error) {

    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create payment";
      throw new Error(msg);
    }

    throw new Error("An unexpected error occurred while creating payment");
  }
};
