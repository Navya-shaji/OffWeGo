import { Booking } from "../../../domain/entities/BookingEntity";
import { BuddyTravel } from "../../../domain/entities/BuddyTripEntity";
import { IBookingRepository } from "../../../domain/interface/Booking/IBookingRepository";
import { BookingModel } from "../../../framework/database/Models/BookingModel";

export class BookingRepository implements IBookingRepository {
  async createBooking(booking: Booking ): Promise<Booking> {
    const createdBooking = new BookingModel({
      ...booking,
      bookingStatus: booking.bookingStatus || "upcoming",
      bookingId: booking.bookingId,
    });
    await createdBooking.save();
    return createdBooking.toObject();
  }

  async findById(id: string): Promise<Booking | null> {
    return BookingModel.findById(id).lean<Booking>().exec();
  }

  async update(id: string, updateData: Partial<Booking>): Promise<Booking> {
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .lean<Booking>()
      .exec();

    if (!updatedBooking) throw new Error("Booking not found");
    return updatedBooking;
  }
  async findByUserId(userId: string): Promise<Booking[]> {
    return BookingModel.find({ userId })
      .populate("selectedPackage")
      .lean<Booking[]>()
      .exec();
  }

  async findByVendorId(vendorId: string): Promise<Booking[]> {
    return BookingModel.find({ vendorId })
      .populate("selectedPackage")
      .populate("userId")
      .lean<Booking[]>()
      .exec();
  }
  async getBookedDatesByVendor(vendorId: string): Promise<Date[]> {
    const bookings = await BookingModel.find({ vendorId })
      .select("selectedDate")
      .lean()
      .exec();

    return bookings.flatMap((b) => b.selectedDate || []);
  }
  async cancelBooking(bookingId: string): Promise<Booking> {
    const updated = await BookingModel.findOneAndUpdate(
      { bookingId },
      { bookingStatus: "cancelled" },
      { new: true }
    )
      .lean<Booking>()
      .exec();

    if (!updated) {
      throw new Error("Booking not found");
    }

    return updated;
  }
async findOne(bookingId: string): Promise<Booking | null> {
  console.log("Finding booking by bookingId:", bookingId);
  const booking = await BookingModel.findOne({ bookingId }).lean<Booking>().exec();
  console.log("Result from DB:", booking);
  return booking;
}

async createbuddyBooking(booking: BuddyTravel): Promise<BuddyTravel> {
  const createdBooking = new BookingModel({
      ...booking,
  });

  await createdBooking.save();
  return createdBooking.toObject() as unknown as BuddyTravel;
}

async BuddyBooking(booking: BuddyTravel): Promise<Booking> {
  const createdBooking = new BookingModel({
      ...booking,
  });

  await createdBooking.save();
  return createdBooking.toObject();
}
}