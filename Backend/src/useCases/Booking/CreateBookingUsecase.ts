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
}: CreateBookingDto): Promise<CreateBookingDto | BuddyBookingDto> {
  console.log(data)
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

  const bookingData: Booking = {
    ...data,
    bookingId: generateBookingId(),
    paymentStatus: "succeeded",
    paymentIntentId: payment_id,
  };

  console.log(bookingData, "bookingzzzzzzz");

  const result = await this._bookingRepository.createBooking(bookingData);
  console.log(result, "result");

  if (result.paymentStatus === "succeeded") {
    const adminId = process.env.ADMIN_ID ||""

    await this._walletRepository.updateBalance(
      adminId,
      Role.ADMIN,
      result.totalAmount,
      "credit",
      `Booking received from user ${result.userId}`
    );
  }

  return mapBookingDto(result);
}

}
