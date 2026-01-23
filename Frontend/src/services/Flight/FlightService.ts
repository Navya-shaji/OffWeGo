import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Flight } from "@/interface/flightInterface";
import { VendorRoutes, VENDOR_ROUTES_BASE } from "@/constants/apiRoutes";

export const addFlight = async (data: Flight) => {
  try {
    const res = await axiosInstance.post(`${VENDOR_ROUTES_BASE}${VendorRoutes.CREATE_FLIGHT}`, data);
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
    const res = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.ALL_FLIGHTS}`);

    if (res.data?.data?.flights && Array.isArray(res.data.data.flights)) {
      return res.data.data.flights;
    }
    if (Array.isArray(res.data?.data)) {
      return res.data.data;
    }
    if (Array.isArray(res.data?.flights)) {
      return res.data.flights;
    }
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
    const res = await axiosInstance.put(`${VENDOR_ROUTES_BASE}${VendorRoutes.EDIT_FLIGHT.replace(":flightId", id)}`, data);

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
    const res = await axiosInstance.delete(`${VENDOR_ROUTES_BASE}${VendorRoutes.DELETE_FLIGHT.replace(":flightId", id)}`);
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
