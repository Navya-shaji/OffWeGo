import { Destination } from "../../entities/DestinationEntity";

export interface IGetAllDestinations{
    execute():Promise<Destination[]|null>
}