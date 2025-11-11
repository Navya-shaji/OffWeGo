import type { Booking } from "../../domain/entities/BookingEntity"; 
import type { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";


export function mapBookingDataToDto(booking: Booking): BookingDataDto {
  return {
    _id: booking._id ?? "",
    userId: booking.userId,
    vendorId: booking.selectedPackage?._id,
    contactInfo: booking.contactInfo,
    adults: booking.adults,
    children: booking.children,
    selectedPackage: booking.selectedPackage,
    selectedDate: booking.selectedDate,
    totalAmount: booking.totalAmount,
    paymentIntentId: booking.paymentIntentId,
    paymentStatus: booking.paymentStatus,
    payment_id: booking.paymentIntentId, 
    bookingId:booking.bookingId,
    bookingStatus:booking.bookingStatus
  };
}


export function mapBookingsArrayToDto(bookings: Booking[]): BookingDataDto[] {
  return bookings.map(mapBookingDataToDto);
}
