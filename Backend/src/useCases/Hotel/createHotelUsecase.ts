import { HotelDto } from "../../domain/dto/package/HotelDto";
import { ICreateHotelUsecase } from "../../domain/interface/Vendor/IcreateHotelUsecase";
import { IHotelRepository } from "../../domain/interface/Vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class CreateHotelUsecase implements ICreateHotelUsecase{
    constructor(private _hotelRepo:IHotelRepository){}

    async execute(data: HotelDto): Promise<HotelDto> {
        const existingHotel=await this._hotelRepo.findByName(data.name)
        if (existingHotel) throw new Error("Hotel with this name already exists");
        const hotel=await this._hotelRepo.createHotel(data)
        return mapToHotelDto(hotel)
    }
}