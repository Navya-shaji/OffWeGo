import { Hotel } from "../../entities/HotelEntity";

export interface ICreateHotelUsecase{
    execute(data:Hotel):Promise<Hotel>
}