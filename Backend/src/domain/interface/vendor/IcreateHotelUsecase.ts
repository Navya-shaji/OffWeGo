import { HotelDto } from "../../dto/package/HotelDto";

export interface ICreateHotelUsecase{
    execute(data:HotelDto):Promise<HotelDto>
}