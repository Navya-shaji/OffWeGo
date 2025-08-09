import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationRepository } from "../../domain/interface/admin/IDestinationInterface";
import { IsearchDestination } from "../../domain/interface/destination/IsearchDestinationusecase";

export class SearchDestination implements IsearchDestination{
    constructor(private destinationRepo:IDestinationRepository){}

    async execute(query: string): Promise<Destination[]> {
        const result=await this.destinationRepo.searchDestination(query)
        return result
    }
}