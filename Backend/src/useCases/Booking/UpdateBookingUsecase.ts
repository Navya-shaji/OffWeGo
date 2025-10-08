// import { IUpdateBookingUseCase } from "../../domain/interface/Booking/IUpdateBookingUsecase"; 
// import { BookingRepository } from "../../adapters/repository/Booking/BookingRepository"; 
// import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto"; 
// import { Booking } from "../../domain/entities/BookingEntity"; 

// export class UpdateBookingUseCase implements IUpdateBookingUseCase {
//   constructor(private _bookingRepository: BookingRepository) {}

//   async execute(bookingId: string, updateData: Partial<CreateBookingDto>): Promise<Booking> {
//     const booking = await this._bookingRepository.findById(bookingId);
//     if (!booking) throw new Error("Booking not found");

//     const updatedBooking = await this._bookingRepository.update(bookingId, { ...updateData, updatedAt: new Date() });
//     return updatedBooking;
//   }
// }
