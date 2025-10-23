import { DestinationDto } from "../../domain/dto/Destination/DestinationDto";
import { DestinationModel } from "../../framework/database/Models/deestinationModel";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper"; 

export class EditDestination {
  async execute(id: string, updatedData: DestinationDto): Promise<DestinationDto  | null> {
    const updatedDoc = await DestinationModel.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedDoc ? mapToDestinationDto(updatedDoc) : null;
  }
}
