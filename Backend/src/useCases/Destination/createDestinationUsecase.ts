import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface"; 
import { CreateDestinationDTO } from "../../domain/dto/admin/DestinationDTO"; 
import { Destination } from "../../domain/entities/DestinationEntity"; 

export class CreateDestination {
  constructor(private  destinationRepo: IDestinationRepository) {}

  async execute(data: CreateDestinationDTO): Promise<Destination> {
    return await this.destinationRepo.createDestination(data);
  }
}