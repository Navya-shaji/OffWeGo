import { BookingDataDto } from "../../dto/Booking/BookingDataDto";


export interface IBookingRescheduleUseCase {

  execute(params: { bookingId: string; newDate: Date }): Promise<BookingDataDto>;
}
