import axiosInstance from "@/axios/instance";
import { getFcmToken } from "@/Firebase/firebase";
import type { SignupSchema } from "@/Types/User/auth/Tsignup";
import { isAxiosError } from "axios";

export const UserRegister = async (formData: SignupSchema) => {
  try {
    const res = await axiosInstance.post("/api/signup",  formData );
    return res;
  } catch (error) {
   
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while client login");
  }
};


export const VerifyOtp = async (userData:SignupSchema,otp:string) => {
  try {
    const res = await axiosInstance.post("/api/verify-otp", { userData,otp} );
    return res;
  } catch (error) {
   
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while verify otp");
  }
};


export const userLogin = async (email:string,password:string,) => {
  try {
     const fcmToken = await getFcmToken();
     console.log(fcmToken)
    const res = await axiosInstance.post("/api/login", {email,password, fcmToken: fcmToken || null  });
    console.log(res.data,"response from login user ")
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
     const fcmToken = await getFcmToken();
    const res=await axiosInstance.post("/api/google-signup",{ token ,fcmToken: fcmToken || null })
    console.log(res,"res")
    return res
  }catch(error){
     console.error("Error while Google signup", error);
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Google signup failed";
      console.error("Google signup error details:", error.response?.data);
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error during Google signup");
  }
}


export const resendOtp=async(email:string)=>{
  try {
    const res=await axiosInstance.post("/api/resend-otp",{email})
 
    return res.data
  }catch (error) {
    
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("error while resnd otp");
  }
}