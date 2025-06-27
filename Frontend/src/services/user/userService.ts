import axiosInstance from "@/axios/instance";
import type { SignupSchema } from "@/Types/User/auth/Tsignup";
import { isAxiosError } from "axios";

export const UserRegister = async (formData: SignupSchema) => {
  try {
    const res = await axiosInstance.post("/signup",  formData );
    return res;
  } catch (error) {
    console.log("error while client login", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while client login");
  }
};


export const VerifyOtp = async (userData:SignupSchema,otp:string) => {
  try {
    const res = await axiosInstance.post("/verify-otp", { userData,otp} );
    return res;
  } catch (error) {
    console.log("error while  verify otp", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while verify otp");
  }
};
