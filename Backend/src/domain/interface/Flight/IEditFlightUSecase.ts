import { FlightDto } from "../../dto/Flight/FlightDto";

export interface IEditFlightUsecase{
    execute(id:string,updatedData:FlightDto):Promise<FlightDto|null>
}