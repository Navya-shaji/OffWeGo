import { CreateBookingDto } from "../../dto/Booking/BookingDto";
import { BuddyBookingDto } from "../../dto/Booking/buddyBookingDto";

export interface ICreateBookingUseCase {
  execute(booking: CreateBookingDto): Promise<CreateBookingDto|BuddyBookingDto>;
}