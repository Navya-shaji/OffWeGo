import { CreateBookingDto } from "../../dto/Booking/BookingDto";
import { Booking } from "../../entities/BookingEntity";

export interface ICreateBookingUseCase {
  execute(booking: CreateBookingDto): Promise<Booking>;
}