import { DestinationDto } from "../../domain/dto/Destination/DestinationDto";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";

export class GetDestination {
  constructor(private _destinationRepo: IDestinationRepository) {}

  async execute(id: string): Promise<DestinationDto| null> {
    const destination = await this._destinationRepo.getDestination(id);
    if (!destination) return null;

    return mapToDestinationDto(destination); 
  }
}
