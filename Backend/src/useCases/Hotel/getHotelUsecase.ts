import { Hotel } from "../../domain/entities/HotelEntity";
import { IgetHotelUsecase } from "../../domain/interface/Vendor/IgetHotelUsevase";
import { IHotelRepository } from "../../domain/interface/Vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class GetHotelUsecase implements IgetHotelUsecase{
    constructor(private _hotelRepo:IHotelRepository){}

    async execute(page:number,limit:number): Promise<{hotels:Hotel[],totalHotels:number}> {
            const skip=(page-1) *limit

        const hotel=await this._hotelRepo.getAllHotel(skip,limit)
        const totalHotels=await this._hotelRepo.countHotels()
        return {
            hotels:hotel.map(mapToHotelDto),
            totalHotels:totalHotels
        }
    }
}