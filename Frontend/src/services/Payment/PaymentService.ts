import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";

// ================== USER PAYMENT ==================

export const createPayment = async (amount: number, currency: string) => {
  try {
    console.log(amount,currency)
    const res = await axiosInstance.post("/api/create-payment", { amount, currency });

    console.log("PaymentIntent response:", res);

    return res.data; 
  } catch (error) {
    console.error("Error creating payment:", error);

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
