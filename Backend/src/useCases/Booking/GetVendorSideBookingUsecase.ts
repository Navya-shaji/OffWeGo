import { BookingDataDto } from "../../domain/dto/Booking/BookingDataDto";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { IGetVendorSideBookingUsecase } from "../../domain/interface/Booking/IGetVendorSideBookingUsecase";
import { mapBookingsArrayToDto } from "../../mappers/Booking/mapToVendorBookingsDto";

export class GetVendorSideBookingUsecase implements IGetVendorSideBookingUsecase {
  constructor(private _bookingRepo: IBookingRepository) {}

  async execute(VendorId: string): Promise<BookingDataDto[]> {  
    const Booking_Data = await this._bookingRepo.findByVendorId(VendorId);
    return mapBookingsArrayToDto(Booking_Data);
  }
}
