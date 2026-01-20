import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";
import { UserRoutes, API_BASE } from "@/constants/apiRoutes";

export const sendOtpForReset = async (email: string) => {
  try {
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.FORGOT_PASSWORD}`, { email })
    return res.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      // Return the error response so frontend can display the message
      return error.response.data
    }
    return { success: false, message: "An Unexpected error during OTP Request" }
  }
}

export const verifyOtpForReset = async (email: string, otp: string) => {
  try {
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.VERIFY_REESET_OTP}`, { email, otp })
    return res.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "failed to verify OTP")
    }
    throw new Error("An unexpected error during Verify otp")
  }
}

export const resetPassword = async (email: string, password: string) => {
  try {

    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.RESET_PASSWORD}`, {
      email,
      newPassword: password,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to reset password");
    }
    throw new Error("An unexpected error occurred during password reset");
  }
};


