import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const getProfile=async()=>{
    try {
        const res=await axiosInstance.get('/profile')
        return res.data
    } catch (error) {
        console.error("Error while getting profile page ")
        if(isAxiosError(error)){
            throw new Error(error.response?.data?.error || "failed to get profile page")
        }
        throw new Error("An Unexpected error during the profile page ")
        
    }
}