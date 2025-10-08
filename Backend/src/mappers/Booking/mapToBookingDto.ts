import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { Booking } from "../../domain/entities/BookingEntity";

export const mapBookingToCreateBookingDto = (bookings: Booking[]): BookingDataDto[] => {
  return bookings.map((b): BookingDataDto => ({
    userId: b.userId,
    contactInfo: b.contactInfo,
    adults: b.adults || [],
    children: b.children || [],
    selectedPackage: b.selectedPackage,
    selectedDate: b.selectedDate,
    totalAmount: b.totalAmount,
    paymentIntentId: b.paymentIntentId,
    paymentStatus: b.paymentStatus,
    payment_id: b.paymentIntentId || "",
  }));
};
