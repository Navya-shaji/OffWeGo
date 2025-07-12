import { DestinationRepository } from "../../adapters/repository/Destination/destinationRepository";
import { Destination } from "../../domain/entities/DestinationEntity";

export class DeleteDestination{
    constructor(private destinationRepo:DestinationRepository){}

async execute(destination: Destination): Promise<void> {
  return this.destinationRepo.delete(destination.id); 
}
}