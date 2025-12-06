import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";

export const mapBookingDto = (b: Booking): CreateBookingDto => ({
  data: {
    userId: b.userId,
    bookingId: b.bookingId,
    contactInfo: b.contactInfo,
    adults: b.adults || [],
    children: b.children || [],
    selectedPackage: b.selectedPackage,
    selectedDate: b.selectedDate,
    totalAmount: b.totalAmount,
    paymentIntentId: b.paymentIntentId,
    paymentStatus: b.paymentStatus,
    bookingStatus: b.bookingStatus,
    settlementDone:b.settlementDone
  },
  payment_id: b.paymentIntentId || "",
  paymentStatus: b.paymentStatus,
});
