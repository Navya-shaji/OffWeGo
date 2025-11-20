import { BuddyBookingDto } from "../../domain/dto/Booking/buddyBookingDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IcreateBuddyBooking } from "../../domain/interface/BuddyTravel/IcreateBuddyBokkkingUsecase";

export class CreateBuddyBookingUsecase  implements IcreateBuddyBooking{
    constructor(
       private  _bookingRepo:IBookingRepository,
      
    ){}

    async execute(booking: BuddyBookingDto): Promise<BuddyBookingDto> {
       
        const result= await this._bookingRepo.createbuddyBooking(booking)
        return result
    }
}