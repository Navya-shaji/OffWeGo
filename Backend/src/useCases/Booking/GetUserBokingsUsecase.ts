import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IGetUserBookingUsecase } from "../../domain/interface/Booking/IGetUserBookingUsecase";
import { mapBookingToCreateBookingDto } from "../../mappers/Booking/mapToBookingDto";

export class GetUserBookingUsecase  implements IGetUserBookingUsecase{
    constructor(private  _bookingRepo:IBookingRepository){}

    async execute(userId:string):Promise<BookingDataDto[]>{
        const User_bookings=await this._bookingRepo.findByUserId(userId)
        // console.log(User_bookings,"user")
        return mapBookingToCreateBookingDto(User_bookings)
    }
}