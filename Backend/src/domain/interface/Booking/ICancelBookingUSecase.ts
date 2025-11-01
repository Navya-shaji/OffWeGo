import { BookingDataDto } from "../../dto/Booking/BookingDataDto";

export interface ICancelBookingUsecase{
    execute(bookingID:string):Promise<BookingDataDto>
}