import { BuddyBookingDto } from "../../domain/dto/Booking/buddyBookingDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IcreateBuddyBooking } from "../../domain/interface/BuddyTravel/IcreateBuddyBokkkingUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";

export class CreateBuddyBookingUsecase  implements IcreateBuddyBooking{
    constructor(
       private  _bookingRepo:IBookingRepository,
        private _walletRepository:IWalletRepository
    ){}

    async execute(booking: BuddyBookingDto): Promise<BuddyBookingDto> {
        const result= await this._bookingRepo.createbuddyBooking(booking)
        return result
    }
}