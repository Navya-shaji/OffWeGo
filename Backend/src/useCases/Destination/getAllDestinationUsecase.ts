import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface"; 
import { Destination } from "../../domain/entities/DestinationEntity"; 
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";

export class GetAllDestinations {
  constructor(private  destinationRepo: IDestinationRepository) {}

  async execute(): Promise<Destination[]> {
   const destination=await this.destinationRepo.getAllDestinations()
   return destination.map(mapToDestinationDto)
  }
}