import { BookingDataDto } from "../../dto/Booking/BookingDataDto";

export interface IGetVendorSideBookingUsecase{
   execute(VendorId:string):Promise<BookingDataDto[]>
}