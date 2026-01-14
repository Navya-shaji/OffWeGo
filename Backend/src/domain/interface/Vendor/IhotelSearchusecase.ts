import { Hotel } from "../../entities/HotelEntity";

export interface ISearchHotelUsecase{
    execute(query:string):Promise<Hotel[]>
}