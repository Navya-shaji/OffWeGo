import { model, ObjectId } from "mongoose";
import { Hotel } from "../../../domain/entities/HotelEntity";
import { HotelSchema } from "../Schema/HotelSchema";

export interface IHotelModel extends Omit<Hotel,"id">,Document{
    _id:ObjectId
}
export const HotelModel=model<IHotelModel>("Hotel",HotelSchema)