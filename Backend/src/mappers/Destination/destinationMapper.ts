import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationModel } from "../../framework/database/Models/deestinationModel";

export const mapToDestinationDto = (doc: IDestinationModel): Destination => ({
  id: doc._id.toString(),
  name: doc.name,
  description: doc.description,
  imageUrls: doc.imageUrls, 
  location: doc.location,
  coordinates: {
    lat: doc.coordinates.lat,   
    lng: doc.coordinates.lng,
  },
});
