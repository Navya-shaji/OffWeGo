import { CreateBookingDto } from "../../dto/Booking/BookingDto";


export interface ICreateBookingUseCase {
  execute(booking: CreateBookingDto): Promise<CreateBookingDto>;
}