/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../domain/interface/Booking/IBookingRepository";
import { BookingModel } from "../../../framework/database/Models/BookingModel";
import { isValidObjectId } from "mongoose";

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
    return (BookingModel as any).findById(id).lean().exec();
  }

  async update(id: string, updateData: Partial<Booking>): Promise<Booking> {
    const updatedBooking = await (BookingModel as any).findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedBooking) throw new Error("Booking not found");
    return updatedBooking;
  }
  async findByUserId(userId: string): Promise<Booking[]> {
    return (BookingModel as any).find({ userId })
      .populate("selectedPackage")
      .lean()
      .exec();
  }

  async findByVendorId(vendorId: string): Promise<Booking[]> {
    return (BookingModel as any).find({ vendorId })
      .populate("selectedPackage")
      .lean()
      .exec();
  }
  async getBookedDatesByVendor(vendorId: string): Promise<Date[]> {
    const bookings = await (BookingModel as any).find({ vendorId })
      .select("selectedDate")
      .lean()
      .exec();

    return bookings.flatMap((b) => b.selectedDate || []);
  }
  async cancelBooking(bookingId: string): Promise<Booking> {
    let updated: Booking | null = null;

    if (isValidObjectId(bookingId)) {
      updated = await (BookingModel as any).findByIdAndUpdate(
        bookingId,
        { bookingStatus: "cancelled" },
        { new: true }
      )
        .lean()
        .exec();
    }

    if (!updated) {
      updated = await (BookingModel as any).findOneAndUpdate(
        { bookingId },
        { bookingStatus: "cancelled" },
        { new: true }
      )
        .lean()
        .exec();
    }

    if (!updated) {
      throw new Error("Booking not found");
    }

    return updated;
  }
  async findOne(bookingId: string): Promise<Booking | null> {
    

    let booking: Booking | null = null;

    if (isValidObjectId(bookingId)) {
      booking = await (BookingModel as any).findById(bookingId).lean().exec();
    }

    if (!booking) {
      booking = await (BookingModel as any).findOne({ bookingId })
        .lean()
        .exec();
    }
  
    return booking;
  }

  async findByPackageAndDate(
    packageId: string,
    selectedDate: Date
  ): Promise<Booking | null> {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const booking = await (BookingModel as any).findOne({
      selectedPackage: packageId,
      selectedDate: { $gte: startOfDay, $lte: endOfDay },
    })
      .lean()
      .exec();

    return booking;
  }
  async findCompletedBookingsForTransfer(): Promise<Booking[]> {
    const today = new Date();

    const bookings = await (BookingModel as any).find({
      selectedPackage: { $exists: true, $ne: null },
      bookingStatus: "completed",
    })
      .populate("selectedPackage")
      .lean();

    const finishedTrips = bookings.filter((booking) => {
      const selectedPackage = booking.selectedPackage;
      if (!selectedPackage?.duration || !booking.selectedDate) return false;

      const endDate = new Date(booking.selectedDate);
      endDate.setDate(endDate.getDate() + selectedPackage.duration);

      return endDate < today;
    });

    const formattedTrips = finishedTrips.map((booking) => ({
      bookingId: booking.bookingId,
      userId: booking.userId,
      vendorId: booking.selectedPackage?.vendorId,
      packageName: booking.selectedPackage?.packageName,
      totalAmount: booking.totalAmount,
      startDate: booking.selectedDate,
      duration: booking.selectedPackage?.duration,
      endDate: new Date(
        new Date(booking.selectedDate).setDate(
          new Date(booking.selectedDate).getDate() +
            booking.selectedPackage.duration
        )
      ),
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
    }));

    
    return formattedTrips as unknown as Booking[];
  }

  async checkBookingExistsBetweenUserAndOwner(
    userId: string,
    ownerId: string
  ): Promise<Booking | null> {
    return (BookingModel as any).findOne({
      userId,
      vendorId: ownerId,
      bookingStatus: { $in: ["upcoming", "confirmed", "ongoing"] },
    })
      .lean()
      .exec();
  }

  async updatePaymentStatus(
    bookingId: string,
    paymentData: { paymentMethod: string; amountPaid: number; status: string }
  ): Promise<Booking> {
    const updatedBooking = await (BookingModel as any).findOneAndUpdate(
      { bookingId },
      {
        paymentStatus: paymentData.status,
        paymentMethod: paymentData.paymentMethod,
        amountPaid: paymentData.amountPaid,
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedBooking) {
      throw new Error("Booking not found");
    }

    return updatedBooking;
  }
  async findByRefId(refId: string): Promise<Booking[]> {
    return (BookingModel as any).find({ bookingId: refId });
  }
  async findCompletedTrips(): Promise<Booking[]> {
    return (BookingModel as any).find({
      bookingStatus: "upcoming",
      settlementDone: false,
      paymentStatus: "succeeded",
      selectedDate: { $lt: new Date() }
    });
  }
}
