import axiosInstance from "@/axios/instance";
import { getFcmToken } from "@/Firebase/firebase";
import type { SignupSchema } from "@/Types/User/auth/Tsignup";
import { isAxiosError } from "axios";
import { UserRoutes, API_BASE } from "@/constants/apiRoutes";

export const UserRegister = async (formData: SignupSchema) => {
  try {
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.SIGNUP}`, formData);
    return res;
  } catch (error) {

    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while client login");
  }
};


export const VerifyOtp = async (userData: SignupSchema, otp: string) => {
  try {
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.VERIFY_OTP}`, { userData, otp });
    return res;
  } catch (error) {

    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while verify otp");
  }
};


export const userLogin = async (email: string, password: string,) => {
  try {
    const fcmToken = await getFcmToken();
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.LOGIN}`, { email, password, fcmToken: fcmToken || null });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Invalid login credentials");
    }
    throw new Error("Unexpected error during login");
  }
};


export const registerGoogleUser = async (token: string) => {
  try {
    const fcmToken = await getFcmToken();
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.GOOGLE_SIGNUP}`, { token, fcmToken: fcmToken || null })
    return res
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Google signup failed";
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error during Google signup");
  }
}


export const resendOtp = async (email: string) => {
  try {
    const res = await axiosInstance.post(`${API_BASE}${UserRoutes.RESEND_OTP}`, { email })

    return res.data
  } catch (error) {

    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while resnd otp");
  }
}