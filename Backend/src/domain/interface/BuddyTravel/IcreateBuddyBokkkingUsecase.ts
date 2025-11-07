import { BuddyBookingDto } from "../../dto/Booking/buddyBookingDto";

export interface IcreateBuddyBooking{
    execute(booking:BuddyBookingDto):Promise<BuddyBookingDto>
}