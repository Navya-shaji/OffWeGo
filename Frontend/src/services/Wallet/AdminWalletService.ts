import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { IWallet } from "@/interface/wallet";
import type { Booking } from "@/interface/Boooking";
import { AdminRoutes, ADMIN_ROUTES_BASE } from "@/constants/apiRoutes";

export const createWallet = async (
  ownerId: string,
  ownerType: "admin"
): Promise<IWallet> => {
  try {
    const response = await axiosInstance.post(`${ADMIN_ROUTES_BASE}${AdminRoutes.ADMIN_WALLET}`, {
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
    const response = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.GET_ADMIN_WALLET.replace(":adminId", id)}`);

    const wallet = response.data;
    if (wallet.transactions && Array.isArray(wallet.transactions)) {
      wallet.transactions = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wallet.transactions.map(async (transaction: any) => {
          const enhancedTransaction = { ...transaction };

          if (transaction.vendorId) {
            try {
              const vendorResponse = await axiosInstance.get(`/api/vendor/${transaction.vendorId}`);
              enhancedTransaction.vendorName = vendorResponse.data.name || vendorResponse.data.businessName || 'Unknown Vendor';
            } catch {
              enhancedTransaction.vendorName = 'Unknown Vendor';
            }
          }

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
            } catch {
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
    const response = await axiosInstance.post(`${ADMIN_ROUTES_BASE}${AdminRoutes.TRANSFER_AMOUNT}`, {
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
    const response = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.COMPLETED_BOOKINGS}`);
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
  } catch {
    throw new Error("Failed to process finished trips");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const completeTripAndDistribute = async (payload: any) => {
  try {
    const { bookingId, adminId, vendorId, amount } = payload;

    const response = await axiosInstance.post(`${ADMIN_ROUTES_BASE}${AdminRoutes.COMPLETED_TRIP}`, {
      bookingId,
      adminId,
      vendorId,
      amount
    });

    return response.data;
  } catch (error: unknown) {
    return {
      success: false,
      message: "Something went wrong",
      error
    };
  }
};