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

export const getCategory=async()=>{

    try {
        
        const res=await axiosInstance.get("/admin/categories")
        return res.data
    } catch (error) {
    if (isAxiosError(error)) {
        console.log("err")
      throw new Error(error.response?.data?.error || "Failed to fetch categories");
    }
    throw new Error("An unexpected error occurred while fetching categories");
    }
}