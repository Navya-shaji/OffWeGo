import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Category } from "@/interface/categoryInterface";

export const addCategory=async (data:Category)=>{
    try {
        console.log("Sending category data:", data); 
        const res=await axiosInstance.post("admin/create-categories",data)
        console.log(res)
        return res.data
    } catch (error) {
        console.error("error adding category",error)
        if(isAxiosError(error)){
            throw new Error(error.response?.data?.error || "failed to add Category");

        }
        throw new Error("An unexpected error occured while adding category")
    }
}