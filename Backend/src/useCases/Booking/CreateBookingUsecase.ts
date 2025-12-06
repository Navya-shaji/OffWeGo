import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICreateBookingUseCase } from "../../domain/interface/Booking/ICreateBookingUSecase";
import { mapBookingDto } from "../../mappers/Booking/mapToCreateBookingDto";
import { generateBookingId } from "../../utilities/BookingIDCreation";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { Role } from "../../domain/constants/Roles";
import { BuddyBookingDto } from "../../domain/dto/Booking/buddyBookingDto";
import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private _bookingRepository: IBookingRepository,
    private _walletRepository: IWalletRepository,
    private _packageRepository: IPackageRepository,  
    private _notificationService: INotificationService 
  ) {}

  async execute({
    data,
    payment_id,
  }: CreateBookingDto): Promise<CreateBookingDto | BuddyBookingDto> {

    const completionDate = new Date(data.selectedDate);

    if (data.selectedPackage.duration) {
      completionDate.setDate(
        completionDate.getDate() + data.selectedPackage.duration
      );
    }


    const existingBooking = await this._bookingRepository.findByPackageAndDate(
      data.selectedPackage._id,
      data.selectedDate
    );

    if (existingBooking) {
      throw new Error("This package is already booked for the selected date.");
    }

    const packageData = await this._packageRepository.findOne({
      _id: data.selectedPackage._id,
    });

    if (!packageData) throw new Error("Package not found");

    const bookingId = generateBookingId();

    const bookingData: Booking = {
      ...data,
      bookingId,
      paymentStatus: "succeeded",
      paymentIntentId: payment_id,
      startDate: "",
      packageId: packageData?.id,
      vendorId: undefined
    };

    const result = await this._bookingRepository.createBooking(bookingData);
  console.log(result.bookingId)
 
    if (result.paymentStatus === "succeeded") {
      const adminId = process.env.ADMIN_ID || "";

      await this._walletRepository.updateBalance(
        adminId,
        Role.ADMIN,
        result.totalAmount,
        "credit",
        `Booking payment received. User: ${result.userId}`,
        result.bookingId   
      );
    }
    const vendorId = packageData.vendorId;
    if (!vendorId) throw new Error("Vendor not found");

    const formattedDate = new Date(data.selectedDate).toLocaleString();

  
    await this._notificationService.send({
      recipientId: result.userId.toString(),
      recipientType: "user",
      title: "Booking Confirmed",
      message: `Your booking for package "${packageData.packageName}" has been confirmed for ${formattedDate}.`,
      createdAt: new Date(),
      read: false
    });

 
    await this._notificationService.send({
      recipientId: vendorId.toString(),
      recipientType: "vendor",
      title: "New Booking Received",
      message: `Booking ${result.bookingId} for package "${packageData.packageName}" has been made by user ${result.userId} for ${formattedDate}.`,
      createdAt: new Date(),
      read: false
    });

    return mapBookingDto(result);
  }
}
