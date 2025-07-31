import { Destination } from "../../domain/entities/DestinationEntity";
import { DestinationModel } from "../../framework/database/Models/deestinationModel";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper"; 

export class EditDestination {
  async execute(id: string, updatedData: Destination): Promise<Destination | null> {
    const updatedDoc = await DestinationModel.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedDoc ? mapToDestinationDto(updatedDoc) : null;
  }
}
