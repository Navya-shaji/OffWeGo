

import { IDestinationRepository } from "../../../domain/interface/admin/IDestinationInterface";
import { Destination } from "../../../domain/entities/DestinationEntity"; 
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { CreateDestinationDTO } from "../../../domain/dto/admin/DestinationDTO"; 

export class DestinationRepository implements IDestinationRepository {
  async createDestination(data: CreateDestinationDTO): Promise<Destination> {
    const created = await DestinationModel.create(data);
    return {
      id: created._id.toString(),
      name: created.name,
      description: created.description,
      imageUrl: created.imageUrl,
      location: created.location,
      coordinates: {
        lat: created.coordinates.lat,
        lng: created.coordinates.lng,
      },
    };
  }

  async getAllDestinations(): Promise<Destination[]> {
    const destinations = await DestinationModel.find();
    return destinations.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      description: d.description,
      imageUrl: d.imageUrl,
      location: d.location,
      coordinates: {
        lat: d.coordinates.lat,
        lng: d.coordinates.lng,
      },
    }));
  }
}
