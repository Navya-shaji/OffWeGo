import { Hotel } from "../../domain/entities/HotelEntity";
import { IHotelRepository } from "../../domain/interface/Vendor/IHotelRepository";
import { ISearchHotelUsecase } from "../../domain/interface/Vendor/IhotelSearchusecase";

export class searchHotelusecase implements ISearchHotelUsecase{
    constructor(private _hotelRepo:IHotelRepository){}

    async execute(query: string): Promise<Hotel[]> {
        const result=await this._hotelRepo.searchHotel(query)
        return result
    }
}