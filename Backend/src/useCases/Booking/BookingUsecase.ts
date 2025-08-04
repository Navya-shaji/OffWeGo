
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepo"; 

export class CreateBooking {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute(data: {
    userId: string;
    packageId: string;
    selectedDate: Date;
  }): Promise<{ success: boolean; message: string }> {
    return await this.bookingRepository.createBooking(data);
  }
}
