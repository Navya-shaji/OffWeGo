import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const getProfile=async()=>{
    try {
        const res=await axiosInstance.get('/api/profile')
        return res.data
    } catch (error) {
        console.error("Error while getting profile page ")
        if(isAxiosError(error)){
            throw new Error(error.response?.data?.error || "failed to get profile page")
        }
        throw new Error("An Unexpected error during the profile page ")
        
    }
}



export const editProfile = async (
  id: string,
  updatedData: { name: string; phone: string; imageUrl?: string }
) => {
  try {
  
    const res = await axiosInstance.patch(`/api/profile/${id}`, updatedData); 
   
    return res.data;
  } catch (error) {
    console.error("Error while editing profile page:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to edit profile.");
    }
    throw new Error("An unexpected error occurred while editing the profile.");
  }
};

