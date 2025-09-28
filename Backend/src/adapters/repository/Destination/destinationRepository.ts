import { IDestinationRepository } from "../../../domain/interface/Admin/IDestinationInterface";
import { DestinationModel,IDestinationModel} from "../../../framework/database/Models/deestinationModel";
import { CreateDestinationDTO } from "../../../domain/dto/admin/DestinationDTO";
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
      .find({ name: { $regex: regex } })
      .select("name location description actions imageUrls")
      .limit(10)
      .exec();
  }
}
