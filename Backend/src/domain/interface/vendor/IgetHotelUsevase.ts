import { Hotel } from "../../entities/HotelEntity";

export interface IgetHotelUsecase{
    execute():Promise<Hotel[]>
}