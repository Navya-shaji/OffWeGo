import axiosInstance from "@/axios/instance";

export const createBooking = async (
    userId: string,
    packageId: string,
    selectedDate: string
) => {
    const response = await axiosInstance.post('/api/create-bookings', {
        userId,
        packageId,
        selectedDate,
    });
  
  return response.data;
};

export const getUserBookings = async (userId: string) => {
  const response = await axiosInstance.get(`/api/bookings/user/${userId}`);
  return response.data.bookings;
};

export const getAllBookings = async () => {
  const response = await axiosInstance.get("/api/admin/bookings");
  return response.data.bookings;
};

export const updateBooking = async (
  bookingId: string,
  updateData: { selectedDate?: string; status?: string }
) => {
  const response = await axiosInstance.patch(`/api/bookings/${bookingId}`, updateData);
  return response.data;
};

export const deleteBooking = async (bookingId: string) => {
  const response = await axiosInstance.delete(`/api/bookings/${bookingId}`);
  return response.data;
};
