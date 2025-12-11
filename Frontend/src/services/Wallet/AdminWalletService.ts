import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";
import type { Booking } from "@/interface/Boooking";

export const createWallet = async (
  ownerId: string,
  ownerType: "admin"
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post("/api/admin/wallet", {
      ownerId,
      ownerType,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create wallet");
    }
    throw new Error("An unexpected error occurred while creating wallet");
  }
};

export const getWallet = async (id: string): Promise<IWallet> => {
  try {
    const response = await axiosInstance.get(`/api/admin/wallet/${id}`);
    console.log(response.data,"hjhhj")
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to get wallet");
    }
    throw new Error("An unexpected error occurred while fetching wallet");
  }
};
export const transferWalletAmount = async (
  adminId: string,
  vendorId: string,
  amount: number
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("Haii")
    const response = await axiosInstance.post("/api/admin/transfer-wallet", {
      adminId,
      vendorId,
      amount,
    });
console.log(response,"res")
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to transfer amount between admin and vendor"
      );
    }
    throw new Error("An unexpected error occurred while transferring amount");
  }
};

export const getFinishedTrips = async (): Promise<Booking[]> => {
  try {
    const response = await axiosInstance.get("/api/admin/completed-bookings");
    console.log(response.data, "Finished Trips Data");
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to fetch finished trip details"
      );
    }
    throw new Error("An unexpected error occurred while fetching trips");
  }
};

// export const processFinishedTrips = async (
//   adminId: string
// ): Promise<void> => {
//   try {
   
//     const completedTrips = await getFinishedTrips();
//     console.log(completedTrips, "Completed Trips");

//     for (const trip of completedTrips) {
//       if (!trip.selectedPackage?.vendorId) continue;

//       const vendorId = trip.selectedPackage.vendorId;
//       const bookingAmount = trip.totalAmount;
//       const vendorShare = bookingAmount * 0.9; 

//       console.log(
//         `Transferring ₹${vendorShare} to vendor ${vendorId} for booking ${trip._id}`
//       );

   
//       await transferWalletAmount(adminId, vendorId, vendorShare);
//     }
//   } catch (error) {
//     console.error("Error processing finished trips:", error);
//     throw new Error("Failed to process finished trips");
//   }
// };

export const completeTripAndDistribute = async (payload) => {
  try {
    const { bookingId, adminId, vendorId, amount } = payload;

    const response = await axiosInstance.post("/api/admin/complete-trip", {
      bookingId,
      adminId,
      vendorId,
      amount
    });
console.log(response,"res")
    return response.data;
  } catch (error:unknown) {
    return {
      success: false,
      message: "Something went wrong",
      error
    };
  }
};