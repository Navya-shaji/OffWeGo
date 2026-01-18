import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";

export class GetAllBookingsUsecase {
    constructor(private _bookingRepo: IBookingRepository) { }

    async execute() {
        return await this._bookingRepo.findAll();
    }
}
