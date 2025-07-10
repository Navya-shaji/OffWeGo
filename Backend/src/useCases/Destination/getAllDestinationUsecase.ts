import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface"; 
import { Destination } from "../../domain/entities/DestinationEntity"; 

export class GetAllDestinations {
  constructor(private  destinationRepo: IDestinationRepository) {}

  async execute(): Promise<Destination[]> {
    return await this.destinationRepo.getAllDestinations();
  }
}