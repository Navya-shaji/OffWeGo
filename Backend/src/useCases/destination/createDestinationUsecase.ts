import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { CreateDestinationDTO } from "../../domain/dto/Admin/DestinationDTO";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";
import { DestinationDto } from "../../domain/dto/Destination/DestinationDto";
export class CreateDestination {
  constructor(private _destinationRepo: IDestinationRepository) {}

  async execute(data: CreateDestinationDTO): Promise<DestinationDto> {
    const created = await this._destinationRepo.createDestination(data);
    return mapToDestinationDto(created);
  }
}
