import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface"; 
import { Destination } from "../../domain/entities/DestinationEntity"; 
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";
import { IGetAllDestinations } from "../../domain/interface/destination/IGetAllDestinations";

export class GetAllDestinations implements IGetAllDestinations{
  constructor(private  destinationRepo: IDestinationRepository) {}

  async execute(page:number,limit:number): Promise<{destinations:Destination[],totalDestinations:number}> {
    const skip=(page-1) *limit
   const destination=await this.destinationRepo.getAllDestinations(skip,limit)
   const totalDestinations=await this.destinationRepo.countDestinations()
   console.log("Usecase of destination",destination)
   return {
    destinations:destination.map(mapToDestinationDto),
    totalDestinations:totalDestinations
   }
  }
}