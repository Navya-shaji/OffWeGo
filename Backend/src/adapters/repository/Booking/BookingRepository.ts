import { Booking } from "../../../domain/entities/BookingEntity";
import { BuddyTravel } from "../../../domain/entities/BuddyTripEntity";
import { IBookingRepository } from "../../../domain/interface/Booking/IBookingRepository";
import { BookingModel } from "../../../framework/database/Models/BookingModel";

export class BookingRepository implements IBookingRepository {
  async createBooking(booking: Booking): Promise<Booking> {
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
      // .populate("userId")
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
    const booking = await BookingModel.findOne({ bookingId })
      .lean<Booking>()
      .exec();
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
  async findByPackageAndDate(
    packageId: string,
    selectedDate: Date
  ): Promise<Booking | null> {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const booking = await BookingModel.findOne({
      selectedPackage: packageId,
      selectedDate: { $gte: startOfDay, $lte: endOfDay },
    })
      .lean<Booking>()
      .exec();

    return booking;
  }
async findCompletedBookingsForTransfer(): Promise<Booking[]> {
  const today = new Date();

  const bookings = await BookingModel.find({
    selectedPackage: { $exists: true, $ne: null },
    bookingStatus: "completed"  
  })
    .populate("selectedPackage")
    .lean();

  const finishedTrips = bookings.filter((booking: any) => {
    const selectedPackage = booking.selectedPackage;
    if (!selectedPackage?.duration || !booking.selectedDate) return false;

    const endDate = new Date(booking.selectedDate);
    endDate.setDate(endDate.getDate() + selectedPackage.duration);

    return endDate < today;
  });

  const formattedTrips = finishedTrips.map((booking: any) => ({
    bookingId: booking.bookingId,
    userId: booking.userId,
    vendorId: booking.selectedPackage?.vendorId,
    packageName: booking.selectedPackage?.packageName,
    totalAmount: booking.totalAmount,
    startDate: booking.selectedDate,
    duration: booking.selectedPackage?.duration,
    endDate: new Date(
      new Date(booking.selectedDate).setDate(
        new Date(booking.selectedDate).getDate() + booking.selectedPackage.duration
      )
    ),
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
  }));

  console.log(formattedTrips, "Finished trip details");
  return formattedTrips as unknown as Booking[];
}


async checkBookingExistsBetweenUserAndOwner(
  userId: string,
  ownerId: string
): Promise<Booking | null> {
  return BookingModel.findOne({
    userId,
    vendorId: ownerId,
    bookingStatus: { $in: ["upcoming", "confirmed", "ongoing"] }
  })
    .lean<Booking>()
    .exec();
}

async updatePaymentStatus(
  bookingId: string,
  paymentData: { paymentMethod: string; amountPaid: number; status: string }
): Promise<Booking> {
  const updatedBooking = await BookingModel.findOneAndUpdate(
    { bookingId },
    { 
      paymentStatus: paymentData.status,
      paymentMethod: paymentData.paymentMethod,
      amountPaid: paymentData.amountPaid
    },
    { new: true }
  )
    .lean<Booking>()
    .exec();

  if (!updatedBooking) {
    throw new Error("Booking not found");
  }

  return updatedBooking;
}

}
