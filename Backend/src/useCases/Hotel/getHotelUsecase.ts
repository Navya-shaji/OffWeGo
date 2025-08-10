import { Hotel } from "../../domain/entities/HotelEntity";
import { IgetHotelUsecase } from "../../domain/interface/vendor/IgetHotelUsevase";
import { IHotelRepository } from "../../domain/interface/vendor/IHotelRepository";

export class GetHotelUsecase implements IgetHotelUsecase{
    constructor(private hotelRepo:IHotelRepository){}

    async execute(): Promise<Hotel[]> {
        const res=await this.hotelRepo.getAllHotel()
        return res
    }
}