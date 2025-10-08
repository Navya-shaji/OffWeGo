import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../domain/interface/Booking/IBookingRepository";
import { BookingModel } from "../../../framework/database/Models/BookingModel";

export class BookingRepository implements IBookingRepository {
  
  async createBooking(booking: Booking): Promise<Booking> {
    const createdBooking = new BookingModel(booking);
    await createdBooking.save();
    return createdBooking.toObject();
  }

async findById(id: string): Promise<Booking | null> {
  return BookingModel.findById(id).lean<Booking>().exec();
}

async update(id: string, updateData: Partial<Booking>): Promise<Booking> {
  const updatedBooking = await BookingModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .lean<Booking>()
    .exec();

  if (!updatedBooking) throw new Error("Booking not found");
  return updatedBooking;
}

}
