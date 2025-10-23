import { Booking } from "../../entities/BookingEntity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  update(id: string, updateData: Partial<Booking>): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByVendorId(vendorId: string): Promise<Booking[]>;
  getBookedDatesByVendor(vendorId:string):Promise<Date[]>
}
