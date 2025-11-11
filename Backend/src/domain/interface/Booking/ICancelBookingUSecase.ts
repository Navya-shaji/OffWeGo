import { BookingDataDto } from "../../dto/Booking/BookingDataDto";

export interface ICancelBookingUsecase{
    execute(bookingId:string):Promise<BookingDataDto>
}