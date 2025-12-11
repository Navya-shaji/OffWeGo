import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Flight } from "@/interface/flightInterface";

export const addFlight = async (data: Flight) => {
  try {
    const res = await axiosInstance.post("/api/vendor/create-flight", data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add flight");
    }
    throw new Error("An unexpected error occurred while adding flight");
  }
};
export const fetchAllFlights = async (): Promise<Flight[]> => {
  try {
    const res = await axiosInstance.get("/api/vendor/flights");
    console.log("Flight service response:", res.data);

    // Backend returns { success: true, data: { flights: FlightDto[] } }
    // Based on GetAllFlightUsecase.execute() which returns { flights: FlightDto[] }
    if (res.data?.data?.flights && Array.isArray(res.data.data.flights)) {
      return res.data.data.flights;
    }
    // Fallback: try direct data array
    if (Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    // Fallback: try flights at root
    if (Array.isArray(res.data?.flights)) {
      return res.data.flights;
    }
    // Fallback: try message/messege (typo support)
    if (Array.isArray(res.data?.message?.flights)) {
      return res.data.message.flights;
    }
    if (Array.isArray(res.data?.messege?.flights)) {
      return res.data.messege.flights;
    }
    // Fallback: direct array
    if (Array.isArray(res.data)) {
      return res.data;
    }

    console.warn("Unexpected flight response structure:", res.data);
    return [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch flights");
    }
    throw new Error("An unexpected error occurred while fetching flights");
  }
};


export const updateFlight = async (id: string, data: Flight) => {
  try {
    const res = await axiosInstance.put(`/api/vendor/flights/${id}`, data);
    console.log("Update flight response:", res.data);
    
    // Backend returns { success: true, message: "...", data: Flight }
    return res.data?.data || res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || "Failed to edit flights");
    }
    throw new Error("An unexpected error occurred while edit flights");
  }
};

export const deleteFlight = async (id: string): Promise<void> => {
  try {
    const res = await axiosInstance.delete(`/api/vendor/flights/${id}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to delete flights"
      );
    }
    throw new Error("An unexpected error occurred while delete flights");
  }
};
