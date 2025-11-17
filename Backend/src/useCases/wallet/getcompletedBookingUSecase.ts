import { Booking } from "../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IGetCompletedBookingsUseCase } from "../../domain/interface/Wallet/ICompletedBookings";


export class GetCompletedBookingsForTransfer implements IGetCompletedBookingsUseCase {
  constructor(private _bookingRepository: IBookingRepository) {}

  async execute(): Promise<Booking[]> {
    const completedBookings = await this._bookingRepository.findCompletedBookingsForTransfer();
    return completedBookings;
  }
}
