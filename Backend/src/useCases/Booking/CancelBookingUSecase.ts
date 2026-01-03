import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICancelBookingUsecase } from "../../domain/interface/Booking/ICancelBookingUSecase";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { mapBookingToCreateBookingDto } from "../../mappers/Booking/mapToBookingDto";
import { Role } from "../../domain/constants/Roles";

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

    // Calculate days until trip
    const timeDifference = bookingDate.getTime() - now.getTime();
    const daysUntilTrip = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    const adminId = process.env.ADMIN_ID || "";
    if (!adminId) throw new Error("Admin ID not configured");

    let userRefundAmount = 0;
    let vendorRefundAmount = 0;
    let adminDebitAmount = 0;
    let refundMessage = "";

    // Refund logic based on cancellation timing
    if (daysUntilTrip > 3) {
      // More than 3 days before trip: 100% refund to user
      userRefundAmount = booking.totalAmount;
      adminDebitAmount = booking.totalAmount;
      refundMessage = `Full refund of ₹${booking.totalAmount} has been processed to your wallet.`;
    } else {
      // 3 days or less before trip: 
      // - 50% refund to user
      // - 40% compensation to vendor
      // - 10% cancellation fee kept by admin
      userRefundAmount = Math.round(booking.totalAmount * 0.5); // 50%
      vendorRefundAmount = Math.round(booking.totalAmount * 0.4); // 40%
      const adminFeeAmount = booking.totalAmount - userRefundAmount - vendorRefundAmount; // 10% (remaining)
      adminDebitAmount = userRefundAmount + vendorRefundAmount; // 90% total (admin keeps 10% as fee)
      
      console.log(`Cancellation refund breakdown: User: ₹${userRefundAmount} (50%), Vendor: ₹${vendorRefundAmount} (40%), Admin fee: ₹${adminFeeAmount} (10%)`);
      
      refundMessage = `Partial refund of ₹${userRefundAmount} (50%) has been processed to your wallet. ₹${vendorRefundAmount} (40%) has been credited to the vendor. A cancellation fee of ₹${adminFeeAmount} (10%) applies.`;
    }

    // Credit refund to user wallet
    if (userRefundAmount > 0) {
      await this._walletRepo.updateBalance(
        booking.userId.toString(),
        "user",
        userRefundAmount,
        "credit",
        `Refund for cancelled booking (${booking.bookingId}) - ${daysUntilTrip > 3 ? 'Full' : '50%'} refund`,
        bookingId
      );
    }

    // Credit vendor if cancellation is within 3 days
    if (vendorRefundAmount > 0) {
      await this._walletRepo.updateBalance(
        vendorId.toString(),
        "vendor",
        vendorRefundAmount,
        "credit",
        `Compensation for cancelled booking (${booking.bookingId}) - 40% of booking amount`,
        bookingId
      );
    }

    // Debit from admin wallet
    // Admin debits the amount paid out (90% if within 3 days, 100% if more than 3 days)
    // Admin keeps 10% as cancellation fee when cancellation is within 3 days
    if (adminDebitAmount > 0) {
      const adminFeeAmount = daysUntilTrip > 3 ? 0 : (booking.totalAmount - adminDebitAmount);
      const adminDescription = daysUntilTrip > 3
        ? `Full refund processed for cancelled booking (${booking.bookingId}) - User refund: ₹${userRefundAmount}`
        : `Refund processed for cancelled booking (${booking.bookingId}) - User: ₹${userRefundAmount} (50%), Vendor: ₹${vendorRefundAmount} (40%), Admin fee retained: ₹${adminFeeAmount} (10%)`;
      
      await this._walletRepo.updateBalance(
        adminId,
        Role.ADMIN,
        adminDebitAmount,
        "debit",
        adminDescription,
        bookingId
      );
    }

    const formattedDate = bookingDate.toLocaleString();

    // Notification to user
    await this._notificationService.send({
      recipientId: booking.userId.toString(),
      recipientType: Role.USER,
      title: "Booking Cancelled",
      message: `Your booking for package "${packageData.packageName}" scheduled on ${formattedDate} has been cancelled. ${refundMessage}`,
      createdAt: new Date(),
      read: false
    });

   
    const vendorMessage = daysUntilTrip > 3
      ? `Booking ${booking.bookingId} for package "${packageData.packageName}" scheduled on ${formattedDate} has been cancelled by the user. Full refund processed.`
      : `Booking ${booking.bookingId} for package "${packageData.packageName}" scheduled on ${formattedDate} has been cancelled by the user. Compensation of ₹${vendorRefundAmount} (40%) has been credited to your wallet.`;

    await this._notificationService.send({
      recipientId: vendorId.toString(),
      recipientType: Role.VENDOR,
      title: "Booking Cancelled",
      message: vendorMessage,
      createdAt: new Date(),
      read: false
    });

    return mapBookingToCreateBookingDto([result])[0];
  }
}
