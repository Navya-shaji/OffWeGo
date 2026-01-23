import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { AdminRoutes, UserRoutes, VendorRoutes, ADMIN_ROUTES_BASE, VENDOR_ROUTES_BASE, USER_ROUTES_BASE } from "@/constants/apiRoutes";

import store from "@/store/store";

export const addDestination = async (data: DestinationInterface) => {
  try {
    const state = store.getState();
    let base = USER_ROUTES_BASE;
    let endpoint = AdminRoutes.CREATE_DESTINATION;
    if (state.adminAuth.token) base = ADMIN_ROUTES_BASE;
    else if (state.vendorAuth.token) {
      base = VENDOR_ROUTES_BASE;
      endpoint = VendorRoutes.CREATE_DESTINATION;
    }
    const res = await axiosInstance.post(`${base}${endpoint}`, data);
    return res.data;
  } catch (error) {
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
    const res = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.GET_DESTINATIONS}`, {
      params: { page, limit },
    });

    const { destinations, totalDestinations, totalPages, currentPage } =
      res.data;

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
    const res = await axiosInstance.put(`${ADMIN_ROUTES_BASE}${AdminRoutes.EDIT_DESTINATION.replace(":id", id)}`, data);

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

export const getsingleDestination = async (id: string, config?: any) => {
  try {
    const res = await axiosInstance.get(
      `${USER_ROUTES_BASE}${UserRoutes.GET_SINGLE_DESTINATION.replace(":id", id)}`,
      config
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to get destination"
      );
    }
    throw new Error("An unexpected error occurred while fetching destination");
  }
};



export const deleteDestination = async (id: string): Promise<void> => {
  try {
    const state = store.getState();
    let base = USER_ROUTES_BASE;
    let endpoint = AdminRoutes.DELETE_DESTINATION;

    if (state.adminAuth.token) base = ADMIN_ROUTES_BASE;
    else if (state.vendorAuth.token) {
      base = VENDOR_ROUTES_BASE;
      endpoint = VendorRoutes.DELETE_DESTINATION;
    }

    const response = await axiosInstance.delete(`${base}${endpoint.replace(":id", id)}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to delete destination"
      );
    }
    throw new Error(
      "An unexpected error occurred while deleting the destination"
    );
  }
};

export const searchDestination = async (query: string) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.SEARCH_DESTINATION}`, {
      params: { q: query },
    });

    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to search destination"
      );
    }
    throw new Error("An unexpected error occured while searching destination");
  }
};

export const getNearbyDestinations = async (
  lat: number,
  lng: number,
  radiusInKm: number
) => {
  try {
    const response = await axiosInstance.post(
      `${ADMIN_ROUTES_BASE}${AdminRoutes.NEARBY_LOCATIONS}`,
      {
        lat,
        lng,
        radiusInKm,
      }
    );
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch nearby destinations"
      );
    }
    throw new Error("An unexpected error occurred while fetching destinations");
  }
};

