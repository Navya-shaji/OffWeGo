/* eslint-disable no-useless-catch */
import axiosInstance from "@/axios/instance";

export const createBooking = async (
  data: string,
  payment_id: string,


) => {

  const response = await axiosInstance.post("/api/create-bookings", {
    data,
    payment_id,

  });

  return response.data;
};


export const getUserBookings = async () => {
  const response = await axiosInstance.get(`/api/bookings`);
  return response.data.data;
};

export const getAllBookingsAdmin = async () => {
  const response = await axiosInstance.get(`/api/admin/all-bookings`);
  return response.data.data;
};

export const getAllUserBookings = async (vendorId: string) => {
  const response = await axiosInstance.get(`/api/vendor/bookings/${vendorId}`);

  return response.data.data;
};

export const bookingdates = async (vendorId: string) => {
  const response = await axiosInstance.get(`/api/vendor/bookings/date/${vendorId}`)
  console.log(response, "res")
  return response.data.data
}
export const cancelBooking = async (bookingId: string, reason?: string) => {
  const response = await axiosInstance.patch(`/api/bookings/${bookingId}`, {
    reason: reason || undefined,
  });
  return response.data;
};

export const rescheduleBooking = async (bookingId: string, newDate: string) => {
  try {
    const response = await axiosInstance.patch(`/api/booking/${bookingId}/reschedule`, {
      newDate,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
