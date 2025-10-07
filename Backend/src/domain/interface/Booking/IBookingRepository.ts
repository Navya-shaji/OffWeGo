import { Booking } from "../../entities/BookingEntity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
}
