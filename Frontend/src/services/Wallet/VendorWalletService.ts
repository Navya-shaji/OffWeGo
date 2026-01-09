import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";

export const createVendorWallet = async (
  ownerId: string,
  ownerType: string
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post("/api/vendor/wallet", {
      ownerId,
      ownerType,
    });

    return response.data.data as IWallet;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create wallet");
    }
    throw new Error("An unexpected error occurred while fetching wallet");
  }
};

export const getVendorWallet = async (id: string): Promise<IWallet> => {
  try {
    const response = await axiosInstance.get(`/api/vendor/wallet/${id}`);
    
    const wallet = response.data;
    if (wallet.transactions && Array.isArray(wallet.transactions)) {
      wallet.transactions = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wallet.transactions.map(async (transaction:any) => {
          const enhancedTransaction = { ...transaction };
          
          if (transaction.vendorId) {
            try {
              const vendorResponse = await axiosInstance.get(`/api/vendor/${transaction.vendorId}`);
              enhancedTransaction.vendorName = vendorResponse.data.name || vendorResponse.data.businessName || 'Unknown Vendor';
            } catch (error) {
              console.error('Failed to fetch vendor details:', error);
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
              console.error('Failed to fetch booking details:', error);
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
