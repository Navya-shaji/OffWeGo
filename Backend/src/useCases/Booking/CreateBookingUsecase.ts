import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICreateBookingUseCase } from "../../domain/interface/Booking/ICreateBookingUSecase";
import { mapCreateBookingDtoToBooking } from "../../mappers/Booking/mapToBookingDto";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(booking: CreateBookingDto): Promise<CreateBookingDto> {
  
    const totalAmount =
      booking.adults.length * booking.selectedPackage.price +
      booking.children.length * booking.selectedPackage.price * 0.8;

    const bookingWithAmount: CreateBookingDto = { ...booking, totalAmount };

    const bookData = await this.bookingRepository.createBooking(bookingWithAmount);

    return mapCreateBookingDtoToBooking(bookData);
  }
}
