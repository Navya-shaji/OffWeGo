import { CreateBookingDto } from "../../domain/dto/Booking/BookingDto";
import { Booking } from "../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../domain/interface/Booking/IBookingRepository";
import { ICreateBookingUseCase } from "../../domain/interface/Booking/ICreateBookingUSecase";

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(private bookingRepository: IBookingRepository) {}

  async execute({data,payment_id}: CreateBookingDto): Promise<Booking> {
    
  
    console.log('dddddddddddd',data)
     console.log(payment_id)
 const bookingData:Booking = {
  ...data,
  paymentIntentId:payment_id,
  paymentStatus:"succeeded",
  status:"succeeded"
 }

const  result = await this.bookingRepository.createBooking(bookingData)
console.log('result',result)

return result}
}
