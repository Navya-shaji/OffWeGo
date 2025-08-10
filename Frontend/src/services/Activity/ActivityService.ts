import axiosInstance from "@/axios/instance";
import type { Activity } from "@/interface/PackageInterface";
import { isAxiosError } from "axios";

export const createActivity=async (data:Activity)=>{
    try {
        const res=await axiosInstance.post('/api/vendor/add-activity',data)
        return res
    } catch (error) {
         console.error("Error adding activity:", error);
            if (isAxiosError(error)) {
              throw new Error(
                error.response?.data?.error || "Failed to add activity"
              );
            }
            throw new Error("An unexpected error occurred while adding activity");
          }
    }
