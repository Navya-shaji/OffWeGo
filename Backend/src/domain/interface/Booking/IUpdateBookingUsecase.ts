import { CreateBookingDto } from "../../dto/Booking/BookingDto";

export interface IUpdateBookingUseCase {
  execute(bookingId: string, updateData: CreateBookingDto): Promise<CreateBookingDto>;
}