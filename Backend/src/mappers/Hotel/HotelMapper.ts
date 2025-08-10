import { Hotel } from "../../domain/entities/HotelEntity";
import { IHotelModel } from "../../framework/database/Models/HotelModel";

export const mapToHotelDto=(doc:IHotelModel):Hotel=>({
    name:doc.name,
    address:doc.address,
    rating:doc.rating  
})