import { Booking } from "../../entities/BookingEntity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  update(id: string, updateData: Partial<Booking>): Promise<Booking>;
}
