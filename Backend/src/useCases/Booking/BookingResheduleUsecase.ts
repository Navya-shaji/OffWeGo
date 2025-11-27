import { IBookingRescheduleUseCase } from "../../domain/interface/Booking/IBookingResheduleusecase";
import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";

export class BookingRescheduleUseCase implements IBookingRescheduleUseCase {
  constructor(private bookingRepository: IBookingRepository) {} 

  async execute({
    bookingId,
    newDate,
  }: {
    bookingId: string;
    newDate: Date;
  }): Promise<BookingDataDto> {
    const booking = await this.bookingRepository.findOne(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (new Date(newDate) < new Date()) {
      throw new Error("Cannot reschedule to a past date");
    }

    const conflictBooking = await this.bookingRepository.findByPackageAndDate(
      booking.selectedPackage._id,
      newDate
    );
    if (conflictBooking && conflictBooking.bookingId !== bookingId) {
      throw new Error("Selected package is already booked on this date");
    }

    const updatedBooking = await this.bookingRepository.update(booking._id!, {
      selectedDate: newDate,
      bookingStatus: "upcoming",
      updatedAt: new Date(),
    });

    return updatedBooking as BookingDataDto;
  }
}
