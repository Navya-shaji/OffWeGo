import { Booking } from "../../../domain/entities/BookingEntity"; 
import { IBookingRepository } from "../../../domain/interface/Booking/IBookingRepository"; 
import { BookingModel } from "../../../framework/database/Models/BookingModel"; 

export class BookingRepository implements IBookingRepository {
  async createBooking(booking: Booking): Promise<Booking> {
    const createdBooking = new BookingModel(booking);
    await createdBooking.save();
    return createdBooking.toObject();
  }
}
