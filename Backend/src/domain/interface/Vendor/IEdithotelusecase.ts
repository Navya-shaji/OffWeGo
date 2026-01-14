import { Hotel } from "../../entities/HotelEntity";

export interface IEditHotelUsecase{
    execute(id:string,updatedData:Hotel):Promise<Hotel|null>
}