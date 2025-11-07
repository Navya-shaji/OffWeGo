import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICreateBookingUseCase } from "../../domain/interface/Booking/ICreateBookingUSecase";
import { mapBookingDto } from "../../mappers/Booking/mapToCreateBookingDto";
import { generateBookingId } from "../../utilities/BookingIDCreation";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { Role } from "../../domain/constants/Roles";
import { BuddyBookingDto } from "../../domain/dto/Booking/buddyBookingDto";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private _bookingRepository: IBookingRepository,
    private _walletRepository: IWalletRepository
  ) {}

  async execute({
    data,
    payment_id,
  }: CreateBookingDto): Promise<CreateBookingDto|BuddyBookingDto> {
    const completionDate = new Date(data.selectedDate);

    if (data.selectedPackage.duration) {
      completionDate.setDate(
        completionDate.getDate() + data.selectedPackage.duration
      );
    }

    const bookedDates = await this._bookingRepository.getBookedDatesByVendor(
      data.selectedPackage._id
    );

    const isConflict = bookedDates.some((date) => {
      const bookedDate = new Date(date);
      return bookedDate >= data.selectedDate && bookedDate <= completionDate;
    });

    if (isConflict) {
      throw new Error("Vendor is already booked for the selected date range.");
    }

    const bookingData: Booking = {
      ...data,
      bookingId: generateBookingId(),
      paymentStatus: "succeeded",
      paymentIntentId: payment_id,
    };


    const result = await this._bookingRepository.createBooking(bookingData);

    if (result.paymentStatus === "succeeded") {
      const adminId = process.env.ADMIN_ID || "68666f952c4ebbe1b6989dd9"; 

      await this._walletRepository.updateBalance(
        adminId,
        Role.ADMIN,
        result.totalAmount,
        "credit",
        `Booking received from user ${result.userId}`,
      );
    }

    return mapBookingDto(result);
  }
}
