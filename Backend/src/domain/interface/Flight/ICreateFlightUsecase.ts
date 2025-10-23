import { FlightDto } from "../../dto/Flight/FlightDto";

export interface ICreateFlightUsecase{
    execute(data:FlightDto):Promise<FlightDto>
}