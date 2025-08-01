import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface";

export class DeleteDestination{
    constructor(private destinationRepo:IDestinationRepository){}

async execute(destination: Destination): Promise<void> {
  return this.destinationRepo.delete(destination.id); 
}
}