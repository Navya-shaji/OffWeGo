import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { DestinationInterface } from "@/interface/destinationInterface";
import type { Package } from "@/interface/PackageInterface";

export const addDestination = async (data: DestinationInterface) => {
  try {
    const res = await axiosInstance.post("/api/admin/create-destination", data);

    return res.data;
  } catch (error) {
    console.error("Error adding destination:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to add destination"
      );
    }
    throw new Error("An unexpected error occurred while adding destination");
  }
};

export const fetchAllDestinations = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  destinations: DestinationInterface[];
  totalDestinations: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const res = await axiosInstance.get("/api/admin/destinations", {
      params: { page, limit },
    });

    const { destinations, totalDestinations, totalPages, currentPage } = res.data;

    if (!Array.isArray(destinations)) {
      console.error("Expected destinations to be an array, got:", destinations);
      return {
        destinations: [],
        totalDestinations: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }

    return {
      destinations,
      totalDestinations,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw new Error("Failed to fetch destinations");
  }
};

export const updateDestination = async (
  id: string,
  data: DestinationInterface
) => {
  try {
    const res = await axiosInstance.put(`/api/admin/edit/${id}`, data);
    console.log(" Updated:", res);
    return res.data;
  } catch (error) {
    console.error(" Error updating destination:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update destination"
      );
    }
    throw new Error("An unexpected error occurred while updating destination");
  }
};

export const getsingleDestination = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/api/destination/${id}`);
    console.log(res);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update destination"
      );
    }
    throw new Error("An unexpected error occurred while updating destination");
  }
};

export const getPackagesByDestination = async (
  destinationId: string
): Promise<Package[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/destination/${destinationId}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update destination"
      );
    }
    throw new Error("An unexpected error occurred while updating destination");
  }
};

export const deleteDestination = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/api/admin/destination/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error inside deleteDestination", error);
    throw error;
  }
};

