import { Hotel } from "../../domain/entities/HotelEntity";
import { IHotelModel } from "../../framework/database/Models/HotelModel";

export const mapToHotelDto=(doc:IHotelModel):Hotel=>({
    hotelId:doc._id.toString(),
    name:doc.name,
    address:doc.address,
    rating:doc.rating  
})