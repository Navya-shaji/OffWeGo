import { Booking } from "../../domain/entities/BookingEntity";
import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";

export const mapBookingToCreateBookingDto = (bookings: Booking[]): CreateBookingDto[] => {
  return bookings.map((b) => {
    return {
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
        settlementDone: b.settlementDone,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
      },
      payment_id: b.paymentIntentId || "",
      paymentStatus: b.paymentStatus,
    };
  });
};
