import { IDestinationRepository } from "../../../domain/interface/Admin/IDestinationInterface";
import {
  DestinationModel,
  IDestinationModel,
} from "../../../framework/database/Models/deestinationModel";
import { CreateDestinationDTO } from "../../../domain/dto/Admin/DestinationDTO";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class DestinationRepository
  extends BaseRepository<IDestinationModel>
  implements IDestinationRepository
{
  constructor() {
    super(DestinationModel);
  }

  async createDestination(
    data: CreateDestinationDTO
  ): Promise<IDestinationModel> {
    return this.create(data);
  }

  async getAllDestinations(
    skip: number,
    limit: number
  ): Promise<IDestinationModel[]> {
    return this.model.find().skip(skip).limit(limit);
  }

  async edit(
    destination: IDestinationModel
  ): Promise<IDestinationModel | null> {
    return this.model.findByIdAndUpdate(destination._id, destination, {
      new: true,
    });
  }

  async delete(id: string): Promise<IDestinationModel | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async getDestination(id: string): Promise<IDestinationModel | null> {
    return this.model.findById(id);
  }

  async countDestinations(): Promise<number> {
    return this.model.countDocuments();
  }

  async searchDestination(query: string): Promise<IDestinationModel[]> {
    const regex = new RegExp(query, "i");
    return this.model

      .find({
        $or: [{ name: { $regex: regex } }, { location: { $regex: regex } }],
      })
      .select("name location description actions imageUrls")
      .limit(10)
      .exec();
  }
  async getNearbyDestinations(
    lat: number,
    lng: number,
    radiusInKm: number
  ): Promise<IDestinationModel[]> {
    const latDelta = radiusInKm / 111;
    const lngDelta = radiusInKm / (111 * Math.cos((lat * Math.PI) / 180));

    const nearby = await this.model.find({
      "coordinates.lat": { $gte: lat - latDelta, $lte: lat + latDelta },
      "coordinates.lng": { $gte: lng - lngDelta, $lte: lng + lngDelta },
    });

    return nearby;
  }
}
