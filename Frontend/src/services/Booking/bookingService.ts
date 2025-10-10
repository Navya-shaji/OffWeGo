import axiosInstance from "@/axios/instance";

export const createBooking = async (
  data: string,              
  payment_id: string,     
  // paymentStatus: string   
) => {
  const response = await axiosInstance.post("/api/create-bookings", {
    data,
    payment_id,
    // paymentStatus,
  });

  return response.data;
};


export const getUserBookings = async (userId: string) => {
  const response = await axiosInstance.get(`/api/bookings/${userId}`);
  console.log(response.data.bookings)
  return response.data.bookings;
};

export const getAllBookings = async () => {
  const response = await axiosInstance.get("/api/admin/bookings");
  console.log(response.data.bookings)
  console.log(response.data.bookingId)
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
