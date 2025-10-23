import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICreateBookingUseCase } from "../../domain/interface/Booking/ICreateBookingUSecase";
import { mapBookingDto } from "../../mappers/Booking/mapToCreateBookingDto";
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute({
    data,
    payment_id,
  }: CreateBookingDto): Promise<CreateBookingDto> {
    const completionDate = new Date(data.selectedDate);
    if (data.selectedPackage.duration) {
      completionDate.setDate(
        completionDate.getDate() + data.selectedPackage.duration
      );
    }

    const bookedDates = await this.bookingRepository.getBookedDatesByVendor(
      data.selectedPackage._id
    );

    const isConflict = bookedDates.some((date) => {
      const bookedDate = new Date(date);
      return bookedDate >= data.selectedDate && bookedDate <= completionDate;
    });

    if (isConflict) {
      throw new Error("Vendor is already booked for the selected date range.");
    }

    const bookingData: Booking = {
      ...data,
      paymentStatus: "succeeded",
      paymentIntentId: payment_id,
    };

    const result = await this.bookingRepository.createBooking(bookingData);
    console.log("Booking created:", result);

    return mapBookingDto(result);
  }
}
