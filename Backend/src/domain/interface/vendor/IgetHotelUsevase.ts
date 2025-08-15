import { Hotel } from "../../entities/HotelEntity";

export interface IgetHotelUsecase{
    execute(page:number,limit:number):Promise<{hotels:Hotel[],totalHotels:number}>
}