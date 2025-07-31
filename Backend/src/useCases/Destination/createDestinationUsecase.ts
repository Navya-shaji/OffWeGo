import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface";
import { CreateDestinationDTO } from "../../domain/dto/admin/DestinationDTO";
import { Destination } from "../../domain/entities/DestinationEntity";
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";
export class CreateDestination {
  constructor(private destinationRepo: IDestinationRepository) {}

  async execute(data: CreateDestinationDTO): Promise<Destination> {
    const created = await this.destinationRepo.createDestination(data);
    return mapToDestinationDto(created);
  }
}
