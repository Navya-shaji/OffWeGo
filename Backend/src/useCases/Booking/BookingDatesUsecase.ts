import { IBookingDatesUsecase } from "../../domain/interface/Booking/IBookingDatesUsecase";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";

export class BookingDateUsecase implements IBookingDatesUsecase {
  constructor(private _bookingRepo: IBookingRepository) {}

  async execute(vendorID: string): Promise<Date[]> {

    const bookedDates = await this._bookingRepo.getBookedDatesByVendor(vendorID);
    return bookedDates;
  }
}
