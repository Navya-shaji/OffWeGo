import { Destination } from "../../domain/entities/DestinationEntity";
import { DestinationModel } from "../../framework/database/Models/deestinationModel";


export class EditDestination {
  async execute(id: string, updatedData:Destination) {
    const updated = await DestinationModel.findByIdAndUpdate(id, updatedData, { new: true });
    return updated;
  }
}
