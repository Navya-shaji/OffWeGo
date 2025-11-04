import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { BuddyTravel } from "@/interface/BuddyTravelInterface"; 
import store from "@/store/store";

// ================== VENDOR-SIDE ==================

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
  price: typeof data.price === "number" ? data.price : parseFloat(String(data.price)),
  maxPeople: typeof data.maxPeople === "number" ? data.maxPeople : parseInt(String(data.maxPeople), 10),
  joinedUsers: data.joinedUsers || [],
};

   
    const res = await axiosInstance.post("/api/vendor/create-buddy-travel", payload);

    console.log("Server response:", res);

    return res.data?.buddyTravel || res.data;
  } catch (error) {
    console.log(error)
    console.error("Error adding buddy travel:", error);

    if (isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add buddy travel";
      throw new Error(msg);
    }

    throw new Error("An unexpected error occurred while adding buddy travel");
  }
};
