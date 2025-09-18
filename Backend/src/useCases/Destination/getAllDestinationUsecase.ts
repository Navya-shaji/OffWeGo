import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface"; 
import { Destination } from "../../domain/entities/DestinationEntity"; 
import { mapToDestinationDto } from "../../mappers/Destination/destinationMapper";
import { IGetAllDestinations } from "../../domain/interface/Destination/IGetAllDestinations";

export class GetAllDestinations implements IGetAllDestinations{
  constructor(private  _destinationRepo: IDestinationRepository) {}

  async execute(page:number,limit:number): Promise<{destinations:Destination[],totalDestinations:number}> {
    const skip=(page-1) *limit
   const destination=await this._destinationRepo.getAllDestinations(skip,limit)
   const totalDestinations=await this._destinationRepo.countDestinations()
   return {
    destinations:destination.map(mapToDestinationDto),
    totalDestinations:totalDestinations
   }
  }
}