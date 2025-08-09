import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";  
import type { Package } from "@/interface/PackageInterface";


export const addPackage= async (data: Package) => {
  try {
    const res = await axiosInstance.post("/api/vendor/add-Package", data);
  
    
    return res.data;
  } catch (error) {
    console.error("Error adding package:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add package");
    }
    throw new Error("An unexpected error occurred while adding destination");
  }
};

export const fetchAllPackages = async () => {
  try {
    const res = await axiosInstance.get("/api/vendor/packages");
    
    return res.data;
  } catch (error) {
    console.error("Error fetching package:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch package");
    }
    throw new Error("An unexpected error occurred while fetching package");
  }
};