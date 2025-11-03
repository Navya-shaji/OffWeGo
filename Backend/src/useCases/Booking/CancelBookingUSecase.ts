import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICancelBookingUsecase } from "../../domain/interface/Booking/ICancelBookingUSecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { mapBookingToCreateBookingDto } from "../../mappers/Booking/mapToBookingDto";

export class cancelBookingUsecase implements ICancelBookingUsecase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _walletRepo:IWalletRepository
  ) {}

  async execute(bookingId: string): Promise<BookingDataDto> {
  const booking = await this._bookingRepo.findOne(bookingId);

  if (!booking) throw new Error("Booking not Found");

  const bookingDate = new Date(booking.selectedDate);
  const now = new Date();
  if (bookingDate <= now) throw new Error("Past bookings cannot be cancelled");

  const result = await this._bookingRepo.cancelBooking(bookingId);

  await this._walletRepo.updateBalance(
    booking.userId.toString(),
    "user",
    booking.totalAmount,
    "credit",
    `Refund for cancelled booking (${bookingId})`,
    bookingId
  );

  return mapBookingToCreateBookingDto([result])[0];
}

}
