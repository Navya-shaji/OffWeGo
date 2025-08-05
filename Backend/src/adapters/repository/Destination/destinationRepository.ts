
import { IDestinationRepository } from "../../../domain/interface/admin/IDestinationInterface";
import { DestinationModel, IDestinationModel } from "../../../framework/database/Models/deestinationModel";
import { CreateDestinationDTO } from "../../../domain/dto/admin/DestinationDTO";

export class DestinationRepository implements IDestinationRepository {
  async createDestination(data: CreateDestinationDTO): Promise<IDestinationModel> {
    return await DestinationModel.create(data);
  }

  async getAllDestinations(skip:number,limit:number): Promise<IDestinationModel[]> {
return await DestinationModel.find().skip(skip).limit(limit);  }

  async edit(destination: IDestinationModel): Promise<void> {
    await DestinationModel.findByIdAndUpdate(destination._id, destination, { new: true });
  }

async delete(id: string): Promise<void> {
  await DestinationModel.findByIdAndDelete(id);
}

 async getDestination(id: string): Promise<IDestinationModel | null> {
  return await DestinationModel.findById(id);
}
async countDestinations(): Promise<number> {
  return await DestinationModel.countDocuments()
}
}
