import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const sendOtpForReset= async (email:string)=>{
    try {
        const res= await axiosInstance.post("/forgot-password",{email})
        console.log(res)
        return res.data
    } catch (error) {
        console.error("Error while sending otp for reset",error)
        if(isAxiosError(error)){
            throw new Error(error.response?.data?.error||"failed to send OTP")
        }
        throw new Error("An Unexpected error during OTP Request")
    }
}

export const verifyOtpForReset=async(email:string,otp:string)=>{
    try {
        const res=await axiosInstance.post("/verify-reset-otp",{email,otp})
        return res.data
    } catch (error) {
        console.error(error)
        if(isAxiosError(error)){
            throw new Error(error.response?.data?.error ||"failed to verify OTP")
        }
        throw new Error("An unexpected error during Verify otp")
    }
}

export const resetPassword = async (email: string, password: string) => {
  try {
    console.log("Sending to backend:", { email, newPassword: password });
    const res = await axiosInstance.post("/reset-password", {
      email,
      newPassword: password,
    });
    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to reset password");
    }
    throw new Error("An unexpected error occurred during password reset");
  }
};


