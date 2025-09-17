import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";

export class GetDestination {
  constructor(private _destinationRepo: IDestinationRepository) {}

  async execute(id: string): Promise<Destination | null> {
    const destination = await this._destinationRepo.getDestination(id);
    if (!destination) return null;

    return mapToDestinationDto(destination); 
  }
}
