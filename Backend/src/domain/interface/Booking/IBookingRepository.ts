import { Booking } from "../../entities/BookingEntity";
import { BuddyTravel } from "../../entities/BuddyTripEntity";

export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  update(id: string, updateData: Partial<Booking>): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByVendorId(vendorId: string): Promise<Booking[]>;
  getBookedDatesByVendor(vendorId: string): Promise<Date[]>;
  cancelBooking(id: string): Promise<Booking>;
  findOne(bookingId: string): Promise<Booking | null>;
  createbuddyBooking(booking: BuddyTravel): Promise<BuddyTravel>;
  findByPackageAndDate(
    packageId: string,
    selectedDate: Date
  ): Promise<Booking | null>;
  findCompletedBookingsForTransfer(): Promise<Booking[]>;
}
