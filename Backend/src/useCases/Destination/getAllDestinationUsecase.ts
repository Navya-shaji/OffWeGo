import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface"; 
import { Destination } from "../../domain/entities/DestinationEntity"; 
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";

export class GetAllDestinations {
  constructor(private  destinationRepo: IDestinationRepository) {}

  async execute(page:number,limit:number): Promise<{destinations:Destination[],totalDestinations:number}> {
    const skip=(page-1) *limit
   const destination=await this.destinationRepo.getAllDestinations(skip,limit)
   const totalDestinations=await this.destinationRepo.countDestinations()
   return {
    destinations:destination.map(mapToDestinationDto),
    totalDestinations:totalDestinations
   }
  }
}