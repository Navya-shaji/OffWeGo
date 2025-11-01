import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICancelBookingUsecase } from "../../domain/interface/Booking/ICancelBookingUSecase";
import { IUserRepository } from "../../domain/interface/UserRepository/IuserRepository";
import { mapBookingToCreateBookingDto } from "../../mappers/Booking/mapToBookingDto";

export class cancelBookingUsecase implements ICancelBookingUsecase {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _userRepo: IUserRepository
  ) {}

  async execute(bookingId: string): Promise<BookingDataDto> {
       console.log("Finding booking by bookingId:", bookingId);
  const booking = await this._bookingRepo.findOne(bookingId);
  console.log(booking)
  if (!booking) throw new Error("Booking not Found");

  if (booking.bookingStatus === "cancelled")
    throw new Error("Booking already cancelled");

  const bookingDate = new Date(booking.selectedDate);
  const now = new Date();
  if (bookingDate <= now)
    throw new Error("Past bookings cannot be cancelled");

  const result = await this._bookingRepo.cancelBooking(bookingId);

  await this._userRepo.updateWallet(booking.userId, booking.totalAmount);

  return mapBookingToCreateBookingDto([result])[0];
}
}