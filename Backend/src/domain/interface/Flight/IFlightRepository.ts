import { IFlightModel } from "../../../framework/database/Models/flightModel";
import { FlightDto } from "../../dto/Flight/FlightDto";
import { Flight } from "../../entities/flightEntity";

export interface IFlightRepository {
  createFlight(flightData: Partial<FlightDto>): Promise<IFlightModel>;
  getFlightById(id: string): Promise<Flight | null>;
  getAllFlights(): Promise<IFlightModel[]>;
  updateFlight(id: string , updateData: Partial<IFlightModel>): Promise<IFlightModel | null>;
  deleteFlight(id: string ): Promise<Flight | null>;
  findByName(name:string):Promise<IFlightModel|null>
}