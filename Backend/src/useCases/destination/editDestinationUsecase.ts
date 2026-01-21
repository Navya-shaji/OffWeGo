import { DestinationDto } from "../../domain/dto/Destination/DestinationDto";
import { DestinationModel } from "../../framework/database/Models/deestinationModel";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";

export class EditDestination {
  constructor(private _destinationRepo: IDestinationRepository) { }

  async execute(id: string, updatedData: DestinationDto): Promise<DestinationDto | null> {
    if (updatedData.name) {
      if (updatedData.name.trim() === "") {
        throw new Error("Destination name cannot be empty");
      }

      const existingDestination = await this._destinationRepo.findByName(updatedData.name);
      if (existingDestination && existingDestination._id.toString() !== id) {
        throw new Error("Destination with this name already exists");
      }
    }

    const updatedDoc = await this._destinationRepo.edit({ ...updatedData, _id: id } as any);
    return updatedDoc ? mapToDestinationDto(updatedDoc) : null;
  }
}
