import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";  
import type { DestinationInterface } from "@/interface/destinationInterface";

export const addDestination = async (data: DestinationInterface) => {
  try {
    const res = await axiosInstance.post("/admin/create-destination", data);
    
    return res.data;
  } catch (error) {
    console.error("Error adding destination:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add destination");
    }
    throw new Error("An unexpected error occurred while adding destination");
  }
};

export const fetchAllDestinations = async () => {
  try {
    const res = await axiosInstance.get("/admin/destinations");
    
    return res.data;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch destinations");
    }
    throw new Error("An unexpected error occurred while fetching destinations");
  }
};
export const updateDestination = async (id: string, data: DestinationInterface) => {
  try {
    const res = await axiosInstance.put(`/admin/edit/${id}`, data); 
    console.log(" Updated:", res);
    return res.data;
  } catch (error) {
    console.error("❌ Error updating destination:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update destination");
    }
    throw new Error("An unexpected error occurred while updating destination");
  }
};
