import { FlightDto } from "../../dto/Flight/FlightDto";

export interface IGetAllFlightUsecase{
    execute():Promise<{flights:FlightDto[]}>
}