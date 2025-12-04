import { IBookingRescheduleUseCase } from "../../domain/interface/Booking/IBookingResheduleusecase";
import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";

export class BookingRescheduleUseCase implements IBookingRescheduleUseCase {
  constructor(
    private _bookingRepository: IBookingRepository,
    private _packageRepository: IPackageRepository,
    private _notificationService: INotificationService
  ) {}

  async execute({
    bookingId,
    newDate,
  }: {
    bookingId: string;
    newDate: Date;
  }): Promise<BookingDataDto> {
    const booking = await this._bookingRepository.findOne(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (new Date(newDate) < new Date()) {
      throw new Error("Cannot reschedule to a past date");
    }

    const conflictBooking = await this._bookingRepository.findByPackageAndDate(
      booking.selectedPackage._id,
      newDate
    );
    if (conflictBooking && conflictBooking.bookingId !== bookingId) {
      throw new Error("Selected package is already booked on this date");
    }

    const updatedBooking = await this._bookingRepository.update(booking._id!, {
      selectedDate: newDate,
      bookingStatus: "upcoming",
      updatedAt: new Date(),
    });

    const packageData = await this._packageRepository.findOne({
      _id: booking.selectedPackage._id,
    });
    if (!packageData) throw new Error("Package not found");

    const vendorId = packageData.vendorId;

    if (!vendorId) throw new Error("Vendor not found");

    const formattedDate = newDate.toLocaleString();

    await this._notificationService.send({
      recipientId: booking.userId.toString(),
      recipientType: "user",
      title: "Booking Rescheduled",
      message: `Your booking for package "${packageData.packageName}" has been rescheduled to ${formattedDate}.`,
      createdAt: new Date(),
      read:false
    });

    await this._notificationService.send({
      recipientId: vendorId.toString(),
      recipientType: "vendor",
      title: "Booking Rescheduled",
      message: `Booking ${booking.bookingId} for package "${packageData.packageName}" has been rescheduled to ${formattedDate}.`,
      createdAt: new Date(),
      read:false
    });

    return updatedBooking as BookingDataDto;
  }
}
