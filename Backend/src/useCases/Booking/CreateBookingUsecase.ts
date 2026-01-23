import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICreateBookingUseCase } from "../../domain/interface/Booking/ICreateBookingUSecase";
import { mapBookingDto } from "../../mappers/Booking/mapToCreateBookingDto";
import { generateBookingId } from "../../utilities/BookingIDCreation";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { Role } from "../../domain/constants/Roles";

import { INotificationService } from "../../domain/interface/Notification/ISendNotification";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";

import { IEmailService } from "../../domain/interface/ServiceInterface/IEmailService";
import { AppError } from "../../domain/errors/AppError";
import { HttpStatus } from "../../domain/statusCode/Statuscode";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";
import { IVendorRepository } from "../../domain/interface/Vendor/IVendorRepository";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private _bookingRepository: IBookingRepository,
    private _walletRepository: IWalletRepository,
    private _packageRepository: IPackageRepository,
    private _destinationRepository: IDestinationRepository,
    private _notificationService: INotificationService,
    private _emailService: IEmailService,
    private _userRepository: IUserRepository,
    private _vendorRepository: IVendorRepository
  ) { }

  async execute({
    data,
    payment_id,
  }: CreateBookingDto): Promise<CreateBookingDto> {

    const completionDate = new Date(data.selectedDate);

    if (data.selectedPackage.duration) {
      completionDate.setDate(
        completionDate.getDate() + data.selectedPackage.duration
      );
    }


    // Get Package details first to check capacity
    const packageData = await this._packageRepository.findOne({
      _id: data.selectedPackage._id,
    });

    if (!packageData) throw new AppError("Package not found", HttpStatus.NOT_FOUND);

    const currentBookingsCount = await this._bookingRepository.countBookingsByPackageAndDate(
      data.selectedPackage._id,
      data.selectedDate
    );

    const maxCapacity = packageData.maxGuests || 10;

    if (currentBookingsCount >= maxCapacity) {
      throw new AppError("This package is fully booked for the selected date.", HttpStatus.CONFLICT);
    }

    let destinationName = "N/A";
    try {
      if (packageData.destinationId) {
        const destination = await this._destinationRepository.getDestination(packageData.destinationId.toString());
        if (destination) {
          destinationName = destination.name || "N/A";
        }
      }
    } catch (error) {
      console.error("Error fetching destination for booking:", error);
    }

    const bookingId = generateBookingId();

    const bookingData: Booking = {
      ...data,
      selectedPackage: {
        packageId: packageData._id.toString(),
        packageName: packageData.packageName,
        price: packageData.price,
        duration: packageData.duration,
        destinationName: destinationName,
        packageImage: packageData.images?.[0] || "",
        vendorId: packageData.vendorId.toString()
      },
      bookingId,
      paymentStatus: "succeeded",
      paymentIntentId: payment_id,
      startDate: new Date().toISOString(),
      packageId: packageData._id.toString(),
      totalAmount: data.totalAmount,
      contactInfo: data.contactInfo,
      adults: data.adults,
      children: data.children,
      userId: data.userId,
      selectedDate: new Date(data.selectedDate),
      vendorId: packageData.vendorId.toString(),
      settlementDone: false,
      bookingStatus: "upcoming"
    };

    const result = await this._bookingRepository.createBooking(bookingData);


    if (result.paymentStatus === "succeeded") {
      try {
        const adminId = process.env.ADMIN_ID || "";

        const user = await this._userRepository.findById(result.userId);
        const vendor = await this._vendorRepository.findById(packageData.vendorId);

        const userName = user?.name || result.contactInfo?.email || 'Unknown User';
        const vendorName = vendor?.name || 'Unknown Vendor';

        await this._walletRepository.updateBalance(
          adminId,
          Role.ADMIN,
          result.totalAmount,
          "credit",
          `Booking payment received. User: ${userName}, Vendor: ${vendorName}`,
          result.bookingId
        );
      } catch (walletError) {
        console.error(" Wallet update failed:", walletError);

      }
    }

    const vendorId = packageData.vendorId;
    const formattedDate = new Date(data.selectedDate).toLocaleString();

    try {
      await this._notificationService.send({
        recipientId: result.userId.toString(),
        recipientType: Role.USER,
        title: "Booking Confirmed",
        message: `Your booking for package "${packageData.packageName}" has been confirmed for ${formattedDate}.`,
        createdAt: new Date(),
        read: false
      });
    } catch (notifError) {
      console.error("User notification failed:", notifError);
    }

    if (vendorId) {
      try {
        await this._notificationService.send({
          recipientId: vendorId.toString(),
          recipientType: Role.VENDOR,
          title: "New Booking Received",
          message: `Booking ${result.bookingId} for package "${packageData.packageName}" has been made by user ${result.userId} for ${formattedDate}.`,
          createdAt: new Date(),
          read: false
        });
      } catch (notifError) {
        console.error(" Vendor notification failed:", notifError);
      }
    }

    const targetEmail = data.contactInfo?.email;
    if (targetEmail) {
      try {
        console.log(`Email service: Sending confirmation to ${targetEmail} for booking ${result._id}`);
        await this._emailService.sendBookingConfirmation(targetEmail, result);
        console.log(` Email service: Confirmation sent for booking ${result._id}`);
      } catch (error) {
        console.error(" Email service: Failed to send confirmation:", error);
      }
    } else {
      console.warn("Email service: No contact email provided. Skipping.");
    }

    return mapBookingDto(result);
  }
}
