import { Booking } from "../../domain/entities/BookingEntity";
import { CreateBookingDto, TravelerDto } from'../../domain/dto/Booking/BookingDto'


const mapTravelerDtoToEntity = (travelerDto: TravelerDto) => ({
  name: travelerDto.name,
  age: travelerDto.age,
  gender: travelerDto.gender,
});


export const mapCreateBookingDtoToBooking = (dto: CreateBookingDto): Booking => ({
  userId: dto.userId,
  contactInfo: {
    email: dto.contactInfo.email,
    mobile: dto.contactInfo.mobile,
    city: dto.contactInfo.city,
    address: dto.contactInfo.address,
  },
  adults: dto.adults.map(mapTravelerDtoToEntity),
  children: dto.children.map(mapTravelerDtoToEntity),
  selectedPackage: {
    _id: dto.selectedPackage._id,
    packageName: dto.selectedPackage.packageName,
    price: dto.selectedPackage.price,
    description: dto.selectedPackage.description,
    duration: dto.selectedPackage.duration,
  },
  selectedDate: dto.selectedDate,
  totalAmount: dto.totalAmount,
});
