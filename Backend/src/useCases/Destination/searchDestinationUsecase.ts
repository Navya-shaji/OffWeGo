import { DestinationDto } from "../../domain/dto/destination/DestinationDto";
import { IDestinationRepository } from "../../domain/interface/Admin/IDestinationInterface";
import { IsearchDestination } from "../../domain/interface/Destination/IsearchDestinationusecase";

export class SearchDestination implements IsearchDestination{
    constructor(private _destinationRepo:IDestinationRepository){}

    async execute(query: string): Promise<DestinationDto[]> {
        const result=await this._destinationRepo.searchDestination(query)
        return result
    }
}