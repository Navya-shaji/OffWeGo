import { Hotel } from "../../domain/entities/HotelEntity";
import { ICreateHotelUsecase } from "../../domain/interface/vendor/IcreateHotelUsecase";
import { IHotelRepository } from "../../domain/interface/vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class CreateHotelUsecase implements ICreateHotelUsecase{
    constructor(private hotelRepo:IHotelRepository){}

    async execute(data: Hotel): Promise<Hotel> {
        const hotel=await this.hotelRepo.createHotel(data)
        return mapToHotelDto(hotel)
    }
}