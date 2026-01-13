import { Booking } from "../../entities/BookingEntity";

export interface IEmailService {
    sendBookingConfirmation(to: string, booking: Booking): Promise<void>;
}
