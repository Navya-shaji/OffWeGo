import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICancelBookingUsecase } from "../../domain/interface/Booking/ICancelBookingUSecase";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { mapBookingToCreateBookingDto } from "../../mappers/Booking/mapToBookingDto";

export class cancelBookingUsecase implements ICancelBookingUsecase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo: IWalletRepository,
    private _packageRepository: IPackageRepository,
    private _notificationService: INotificationService
  ) {}

  async execute(bookingId: string): Promise<BookingDataDto> {
    const booking = await this._bookingRepo.findOne(bookingId);

    if (!booking) throw new Error("Booking not Found");

    const bookingDate = new Date(booking.selectedDate);
    const now = new Date();
    if (bookingDate <= now)
      throw new Error("Past bookings cannot be cancelled");

    const result = await this._bookingRepo.cancelBooking(bookingId);

    const packageData = await this._packageRepository.findOne({
      _id: booking.selectedPackage._id,
    });
    if (!packageData) throw new Error("Package not found");

    const vendorId = packageData.vendorId;
    if (!vendorId) throw new Error("Vendor not found");


    await this._walletRepo.updateBalance(
      booking.userId.toString(),
      "user",
      booking.totalAmount,
      "credit",
      `Refund for cancelled booking (${bookingId})`,
      bookingId
    );

  
    const formattedDate = bookingDate.toLocaleString();

    
    await this._notificationService.send({
      recipientId: booking.userId.toString(),
      recipientType: "user",
      title: "Booking Cancelled",
      message: `Your booking for package "${packageData.packageName}" scheduled on ${formattedDate} has been cancelled. Refund of ₹${booking.totalAmount} has been processed.`,
      createdAt: new Date(),
      read:false
    });

 
    await this._notificationService.send({
      recipientId: vendorId.toString(),
      recipientType: "vendor",
      title: "Booking Cancelled",
      message: `Booking ${booking.bookingId} for package "${packageData.packageName}" scheduled on ${formattedDate} has been cancelled by the user.`,
      createdAt: new Date(),
      read:false
    });

    return mapBookingToCreateBookingDto([result])[0];
  }
}
