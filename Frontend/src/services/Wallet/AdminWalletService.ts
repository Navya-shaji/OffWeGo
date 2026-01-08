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
    
    // Enhance transactions with additional details
    const wallet = response.data;
    if (wallet.transactions && Array.isArray(wallet.transactions)) {
      wallet.transactions = await Promise.all(
        wallet.transactions.map(async (transaction: any) => {
          const enhancedTransaction = { ...transaction };
          
          // If there's a vendorId, fetch vendor name
          if (transaction.vendorId) {
            try {
              const vendorResponse = await axiosInstance.get(`/api/vendor/${transaction.vendorId}`);
              enhancedTransaction.vendorName = vendorResponse.data.name || vendorResponse.data.businessName || 'Unknown Vendor';
            } catch (error) {
              enhancedTransaction.vendorName = 'Unknown Vendor';
            }
          }
          
          // If there's a bookingId, fetch booking details
          if (transaction.bookingId) {
            try {
              const bookingResponse = await axiosInstance.get(`/api/booking/${transaction.bookingId}`);
              const booking = bookingResponse.data;
              enhancedTransaction.bookingDetails = {
                packageName: booking.package?.name || booking.packageName || 'Unknown Package',
                destinationName: booking.destination?.name || booking.destinationName || 'Unknown Destination',
                tripDate: booking.tripDate || booking.date,
                userName: booking.user?.name || booking.userName || 'Unknown User'
              };
            } catch (error) {
              enhancedTransaction.bookingDetails = {
                packageName: 'Unknown Package',
                destinationName: 'Unknown Destination'
              };
            }
          }
         
          return enhancedTransaction;
        })
      );
    }
    
    return wallet;
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
    const response = await axiosInstance.post("/api/admin/transfer-wallet", {
      adminId,
      vendorId,
      amount,
    });
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

export const processFinishedTrips = async (
  adminId: string
): Promise<void> => {
  try {
   
    const completedTrips = await getFinishedTrips();

    for (const trip of completedTrips) {
      if (!trip.selectedPackage?.vendorId) continue;

      const vendorId = trip.selectedPackage.vendorId;
      const bookingAmount = trip.totalAmount;
      const vendorShare = bookingAmount * 0.9; 


   
      await transferWalletAmount(adminId, vendorId, vendorShare);
    }
  } catch (error) {
   
    throw new Error("Failed to process finished trips");
  }
};

export const completeTripAndDistribute = async (payload: any) => {
  try {
    const { bookingId, adminId, vendorId, amount } = payload;

    const response = await axiosInstance.post("/api/admin/complete-trip", {
      bookingId,
      adminId,
      vendorId,
      amount
    });

    return response.data;
  } catch (error:unknown) {
    return {
      success: false,
      message: "Something went wrong",
      error
    };
  }
};