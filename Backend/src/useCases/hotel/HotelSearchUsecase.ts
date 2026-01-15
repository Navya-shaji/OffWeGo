import { HotelDto } from "../../domain/dto/Package/HotelDto";
import { IHotelRepository } from "../../domain/interface/Vendor/IHotelRepository";
import { ISearchHotelUsecase } from "../../domain/interface/Vendor/IhotelSearchusecase";

export class searchHotelusecase implements ISearchHotelUsecase {
    constructor(private _hotelRepo: IHotelRepository) { }

    async execute(query: string): Promise<HotelDto[]> {
        const result = await this._hotelRepo.searchHotel(query)
        return result
    }
}