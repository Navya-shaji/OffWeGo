import { Hotel } from "../../domain/entities/HotelEntity";
import { IHotelRepository } from "../../domain/interface/vendor/IHotelRepository";
import { ISearchHotelUsecase } from "../../domain/interface/vendor/IhotelSearchusecase";

export class searchHotelusecase implements ISearchHotelUsecase{
    constructor(private hotelRepo:IHotelRepository){}

    async execute(query: string): Promise<Hotel[]> {
        const result=await this.hotelRepo.searchHotel(query)
        return result
    }
}