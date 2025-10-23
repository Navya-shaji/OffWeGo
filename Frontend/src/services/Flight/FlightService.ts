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
    console.log("service", res.data);

    return res.data?.messege?.flights || [];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch flights");
    }
    throw new Error("An unexpected error occurred while fetching flights");
  }
};


export const updateFlight = async (id: string, data: Flight) => {
  try {
    const res = await axiosInstance.put(`/api/vendor/flights/${id}`, data);
    console.log(res.data.flights)
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to edit flights");
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
