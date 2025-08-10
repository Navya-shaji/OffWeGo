import { IHotelModel } from "../../../framework/database/Models/HotelModel";
import { Hotel } from "../../entities/HotelEntity";

export interface IHotelRepository{
    createHotel(data:Hotel):Promise<IHotelModel>
    getAllHotel():Promise<IHotelModel[]>
}