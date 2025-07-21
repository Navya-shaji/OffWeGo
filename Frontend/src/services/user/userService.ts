import axiosInstance from "@/axios/instance";
import type { LoginFormData } from "@/Types/User/auth/loginZodSchema";
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


export const userLogin = async (formData: LoginFormData) => {
  try {
    const res = await axiosInstance.post("/login", formData);
    return res.data; 
  } catch (error) {
    console.error("Error while client login", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Invalid login credentials");
    }
    throw new Error("Unexpected error during login");
  }
};


export const registerGoogleUser=async (token: string)=>{
  try{
    const res=await axiosInstance.post("/google-signup",{ token })
    return res
  }catch(error){
     console.error("Error while Google signup", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Google signup failed");
    }
    throw new Error("Unexpected error during Google signup");
  }
}


export const resendOtp=async(email:string)=>{
  try {
    const res=await axiosInstance.post("/resend-otp",{email})
    console.log(res)
    return res.data
  }catch (error) {
    console.log("error while  resend otp", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while resnd otp");
  }
}