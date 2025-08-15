import { Hotel } from "../../domain/entities/HotelEntity";
import { IgetHotelUsecase } from "../../domain/interface/vendor/IgetHotelUsevase";
import { IHotelRepository } from "../../domain/interface/vendor/IHotelRepository";
import { mapToHotelDto } from "../../mappers/Hotel/HotelMapper";

export class GetHotelUsecase implements IgetHotelUsecase{
    constructor(private hotelRepo:IHotelRepository){}

    async execute(page:number,limit:number): Promise<{hotels:Hotel[],totalHotels:number}> {
            const skip=(page-1) *limit

        const hotel=await this.hotelRepo.getAllHotel(skip,limit)
        const totalHotels=await this.hotelRepo.countHotels()
        return {
            hotels:hotel.map(mapToHotelDto),
            totalHotels:totalHotels
        }
    }
}