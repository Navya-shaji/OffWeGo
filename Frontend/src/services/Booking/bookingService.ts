import axiosInstance from "@/axios/instance";

export const createBooking = async (
    userId: string,
    packageId: string,
    selectedDate: string
) => {
    const response = await axiosInstance.post(`/bookings/${packageId}`, {
        userId,
        packageId,
        selectedDate,
    });
    console.log("Haii")
  console.log("Calling createBooking with packageId:", packageId);
  return response.data;
};

export const getUserBookings = async (userId: string) => {
  const response = await axiosInstance.get(`/bookings/user/${userId}`);
  return response.data.bookings;
};

export const getAllBookings = async () => {
  const response = await axiosInstance.get("/admin/bookings");
  return response.data.bookings;
};

export const updateBooking = async (
  bookingId: string,
  updateData: { selectedDate?: string; status?: string }
) => {
  const response = await axiosInstance.patch(`/bookings/${bookingId}`, updateData);
  return response.data;
};

export const deleteBooking = async (bookingId: string) => {
  const response = await axiosInstance.delete(`/bookings/${bookingId}`);
  return response.data;
};
