import axiosInstance from "@/axios/instance";

export const createBooking = async (
  data: string,              
  payment_id: string,    
   
 
) => {
  
  const response = await axiosInstance.post("/api/create-bookings", {
    data,
    payment_id,
 
  });
  
console.log(response.data,"response")
  return response.data;
};


export const getUserBookings = async () => {
  const response = await axiosInstance.get(`/api/bookings`);
  console.log(response.data.bookings,"bookings")
  return response.data.bookings;
};

export const getAllUserBookings = async (vendorId:string) => {
  const response = await axiosInstance.get(`/api/vendor/bookings/${vendorId}`);
  console.log(response.data.bookings,"bookings")
 
  return response.data.bookings;
};

export const bookingdates=async(vendorId:string)=>{
  const response=await axiosInstance.get(`/api/vendor/bookings/date/${vendorId}`)
  console.log(response.data.booking_dates,"hfjh")
  return response.data.booking_dates
}
export const cancelBooking = async (bookingId: string) => {
  const response = await axiosInstance.patch(`/api/bookings/${bookingId}`);
  console.log(response)
  return response.data
};

export const rescheduleBooking = async (bookingId: string, newDate: string) => {
  try {
    const response = await axiosInstance.patch(`/api/booking/${bookingId}/reschedule`, {
      newDate,
    });
    console.log(response.data, "reschedule response");
    return response.data;
  } catch (error) {
    console.error("Error rescheduling booking:");
    throw error;
  }
};
