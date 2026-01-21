import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { CreateDestinationDTO } from "../../domain/dto/Admin/DestinationDTO";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";
import { DestinationDto } from "../../domain/dto/Destination/DestinationDto";
export class CreateDestination {
  constructor(private _destinationRepo: IDestinationRepository) { }

  async execute(data: CreateDestinationDTO): Promise<DestinationDto> {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Destination name cannot be empty");
    }

    const existingDestination = await this._destinationRepo.findByName(data.name);
    if (existingDestination) {
      throw new Error("Destination with this name already exists");
    }

    const created = await this._destinationRepo.createDestination(data);
    return mapToDestinationDto(created);
  }
}
