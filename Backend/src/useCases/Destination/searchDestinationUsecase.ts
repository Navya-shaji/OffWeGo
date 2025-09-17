import { Destination } from "../../domain/entities/DestinationEntity";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { IsearchDestination } from "../../domain/interface/Destination/IsearchDestinationusecase";

export class SearchDestination implements IsearchDestination{
    constructor(private _destinationRepo:IDestinationRepository){}

    async execute(query: string): Promise<Destination[]> {
        const result=await this._destinationRepo.searchDestination(query)
        return result
    }
}