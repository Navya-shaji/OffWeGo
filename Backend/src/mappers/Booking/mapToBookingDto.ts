import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";

export const mapCreateBookingDtoToBooking = (dto: CreateBookingDto): Booking => {
  return {
    userId: dto.userId,
    contactInfo: dto.contactInfo,
    adults: dto.adults,
    children: dto.children,
    selectedPackage: dto.selectedPackage,
    selectedDate: dto.selectedDate,
    totalAmount: dto.totalAmount,
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const mapBookingToCreateBookingDto = (booking: Booking): CreateBookingDto => {
  return {
    userId: booking.userId,
    contactInfo: booking.contactInfo,
    adults: booking.adults,
    children: booking.children,
    selectedPackage: booking.selectedPackage,
    selectedDate: booking.selectedDate,
    totalAmount: Number(booking.totalAmount),
  };
};
