import { Booking } from "../../entities/BookingEntity";


export interface IGetCompletedBookingsUseCase {
  execute(): Promise<Booking[]>;
}