import { BookingDataDto } from "../../dto/Booking/BookingDataDto";

export interface IGetUserBookingUsecase{
    execute(userId:string):Promise<BookingDataDto[]>
}