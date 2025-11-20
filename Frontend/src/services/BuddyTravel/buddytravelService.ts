import axios, { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { BuddyTravel } from "@/interface/BuddyTravelInterface";
import store from "@/store/store";

export const addBuddyTravel = async (data: BuddyTravel) => {
  try {
    const state = store.getState();
    const vendorId = state.vendorAuth?.vendor?.id;

    if (!vendorId) {
      throw new Error("Vendor ID not found in store");
    }

    const payload = {
      vendorId,
      title: data.title,
      description: data.description,
      category: data.category,
      destination: data.destination,

      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),

      price: Number(data.price),
      maxPeople: Number(data.maxPeople),
      joinedUsers: data.joinedUsers || [],

      itinerary: data.itinerary || [],
      hotels: data.hotels || [],
      activities: data.activities || [],
    };

    const res = await axiosInstance.post(
      "/api/vendor/create-buddy-travel",
      payload
    );

    return res.data?.buddyTravel || res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        "Failed to add buddy travel"
      );
    }

    throw new Error("Subscription limit exceeded");
  }
};


export const updateBuddyPackageStatus = async (
  buddyId: string,
  status: "pending" | "approve" | "reject"
) => {
  try {
    console.log("resss");
    const response = await axiosInstance.patch(
      `/api/admin/buddy-travel/${buddyId}`,
      { status }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating buddy package status:", error);

    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update buddy package status";
      throw new Error(msg);
    }

    throw new Error(
      "An unexpected error occurred while updating package status"
    );
  }
};

export const getBuddyTravelPackages = async (status: string) => {
  try {
    console.log("bbfhb");
    const response = await axiosInstance.get(
      `/api/admin/buddy-packages/:status`,
      {
        params: { status },
      }
    );
    console.log(response.data.data, "res");
    return response.data.data || [];
  } catch (error) {
    console.error(" Error fetching buddy travel packages:", error);

    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch buddy travel packages";
      throw new Error(msg);
    }

    throw new Error("An unexpected error occurred while fetching packages");
  }
};

export const getBuddypackagesByvendor = async (vendorId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/vendor/buddy-packages/${vendorId}`
    );
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch buddy travel packages";
      throw new Error(msg);
    }

    throw new Error("An unexpected error occurred while fetching packages");
  }
};

export const getAllBuddyPackages = async () => {
  try {
    const response = await axiosInstance.get("/api/buddy-packages");

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch buddy travel packages");
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch buddy travel packages";
      throw new Error(msg);
    }

    throw new Error("An unexpected error occurred while fetching packages");
  }
};
export const joinBuddyTravel = async (
  userId: string,
  travelId: string
): Promise<BuddyTravel> => {
  try {
    const response = await axiosInstance.post(
      `/api/join-travel/${travelId}/${userId}`,
      {},
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to join buddy travel"
      );
    }
    throw error;
  }
};

export const createBuddyTravelBooking = async (data: BuddyTravel) => {
  try {
    const response = await axiosInstance.post("/api/booking/travel", { data });
    console.log("Buddy travel booking created:", response);
    return response.data;
  } catch (error) {
 if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to join buddy travel"
      );
    }
    throw error;
  }
};