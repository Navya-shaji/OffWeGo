import axiosInstance from "@/axios/instance";
import type { Hotel } from "@/interface/PackageInterface";
import { isAxiosError } from "axios";
import { VendorRoutes, VENDOR_ROUTES_BASE } from "@/constants/apiRoutes";

export const createHotel = async (data: Hotel, destinationId: string) => {
  try {
    const res = await axiosInstance.post(
      `${VENDOR_ROUTES_BASE}${VendorRoutes.CREATE_HOTEL.replace(":packageId", destinationId)}`,
      data
    );
    return res;
  } catch (error) {
    console.error("Error adding hotel", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add hotel");
    }
    throw new Error("An unexpected error occurred while adding hotel");
  }
};

export const getAllHotel = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  hotels: Hotel[];
  totalHotels: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const res = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.HOTELS}`, {
      params: { page, limit },
    });

    const { hotels = [], totalHotels = 0 } = res.data.data;

    if (!Array.isArray(hotels)) {
      return {
        hotels: [],
        totalHotels: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }

    return {
      hotels,
      totalHotels,
      totalPages: Math.ceil(totalHotels / limit),
      currentPage: page,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch hotels");
    }
    throw new Error("An unexpected error occurred while fetching hotels");
  }
};

export const updateHotel = async (id: string, data: Hotel) => {
  try {
    const res = await axiosInstance.put(`${VENDOR_ROUTES_BASE}${VendorRoutes.EDIT_HOTEL.replace(":hotelId", id)}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update hotel");
    }
    throw new Error("An unexpected error occurred while updating hotel");
  }
};

export const deleteHotel = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${VENDOR_ROUTES_BASE}${VendorRoutes.DELETE_HOTEL.replace(":hotelId", id)}`);

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete hotel"
      );
    }
    throw new Error("An unexpected error occurred while deleting hotel");
  }
};

export const searchHotel = async (query: string) => {
  const response = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.SEARCH_HOTEL}`, {
    params: { q: query },
  });

  return response.data.data;
};
