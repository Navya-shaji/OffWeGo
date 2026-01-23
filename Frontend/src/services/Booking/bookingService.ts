/* eslint-disable no-useless-catch */
import axiosInstance from "@/axios/instance";
import { AdminRoutes, UserRoutes, VendorRoutes, USER_ROUTES_BASE, ADMIN_ROUTES_BASE, VENDOR_ROUTES_BASE } from "@/constants/apiRoutes";

export const createBooking = async (
  data: string,
  payment_id: string,
  config?: any
) => {
  const response = await axiosInstance.post(`${USER_ROUTES_BASE}${UserRoutes.CREATE_BOOKING}`, {
    data,
    payment_id,
  }, config);

  return response.data;
};


export const getUserBookings = async (config?: any) => {
  const response = await axiosInstance.get(`${USER_ROUTES_BASE}${UserRoutes.USER_BOOKINGS}`, config);
  return response.data.data;
};

export const getAllBookingsAdmin = async () => {
  const response = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.GET_ALL_BOOKINGS}`);
  return response.data.data;
};

export const getAllUserBookings = async (vendorId: string) => {
  const response = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.USER_BOOKINGS.replace(":vendorId", vendorId)}`);

  return response.data.data;
};

export const bookingdates = async (vendorId: string) => {
  const response = await axiosInstance.get(`${VENDOR_ROUTES_BASE}${VendorRoutes.BOOKING_DATES.replace(":vendorId", vendorId)}`)
  console.log(response, "res")
  return response.data.data
}
export const cancelBooking = async (bookingId: string, reason?: string) => {
  const response = await axiosInstance.patch(`${USER_ROUTES_BASE}${UserRoutes.CANCEL_BOOKING.replace(":bookingId", bookingId)}`, {
    reason: reason || undefined,
  });
  return response.data;
};

export const rescheduleBooking = async (bookingId: string, newDate: string) => {
  try {
    const response = await axiosInstance.patch(`${USER_ROUTES_BASE}${UserRoutes.BOOKING_RESHEDULE.replace(":bookingId", bookingId)}`, {
      newDate,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMostOrderedPackage = async () => {
  const response = await axiosInstance.get(`${ADMIN_ROUTES_BASE}/most-ordered-package`);
  return response.data.data;
};
