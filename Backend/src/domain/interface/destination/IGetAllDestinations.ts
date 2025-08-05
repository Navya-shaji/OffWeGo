import { Destination } from "../../entities/DestinationEntity";

export interface IGetAllDestinations{
    execute(page:number,limit:number):Promise<{destinations:Destination[],totalDestinations:number}>
}