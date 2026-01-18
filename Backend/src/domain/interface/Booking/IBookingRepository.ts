import { Booking } from "../../entities/BookingEntity";


export interface IBookingRepository {
  createBooking(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  update(id: string, updateData: Partial<Booking>): Promise<Booking>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByVendorId(vendorId: string): Promise<Booking[]>;
  getBookedDatesByVendor(vendorId: string): Promise<Date[]>;
  cancelBooking(id: string): Promise<Booking>;
  findOne(bookingId: string): Promise<Booking | null>;
  findByPackageAndDate(
    packageId: string,
    selectedDate: Date
  ): Promise<Booking | null>;
  findCompletedBookingsForTransfer(): Promise<Booking[]>;
  checkBookingExistsBetweenUserAndOwner(
    userId: string,
    ownerId: string
  ): Promise<Booking | null>;
  updatePaymentStatus(
    bookingId: string,
    paymentData: {
      paymentMethod: string;
      amountPaid: number;
      status: "paid" | "pending" | "failed";
    }
  ): Promise<Booking>;
  findByRefId(refId: string): Promise<Booking[]>;
  findCompletedTrips(): Promise<Booking[]>;
  findAll(): Promise<Booking[]>;
}
