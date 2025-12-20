import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { ISubscriptionBookingModel } from "../../framework/database/Models/SubscriptionBookingModel";

export const mapSubscriptionBookingToDto = (
  booking: ISubscriptionBookingModel
): BookingDataDto => {
  return {
    _id: booking._id.toString(),
    bookingId: booking._id.toString(),
    userId: booking.vendorId,
    
    contactInfo: { email: "", mobile: "", city: "", address: "" }, 
    adults: [],
    children: [],
    selectedPackage: { _id: booking.planId.toString(), packageName: booking.planName, price: booking.amount },
    selectedDate: booking.startDate || new Date(),
    
    totalAmount: booking.amount,
    paymentIntentId: booking.stripeSessionId,
    paymentStatus: "succeeded",
    payment_id: booking.stripeSessionId || "",
    bookingStatus: "upcoming", 
    settlementDone:true
  };
};
