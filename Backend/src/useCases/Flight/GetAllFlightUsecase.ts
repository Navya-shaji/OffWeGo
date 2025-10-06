import { FlightDto } from "../../domain/dto/Flight/FlightDto";
import { IFlightRepository } from "../../domain/interface/Flight/IFlightRepository";
import { IGetAllFlightUsecase } from "../../domain/interface/Flight/IGetAllFlightUsecase";
import { mapToFlightDto } from "../../mappers/Flight/mapToFlight";

export class GetAllFlightUsecase implements IGetAllFlightUsecase {
  constructor(private _flightRepo: IFlightRepository) {}

  async execute(): Promise<{ flights: FlightDto[] }> {
    const flights = await this._flightRepo.getAllFlights();
    const flightDtos = flights.map(mapToFlightDto);
    return { flights: flightDtos };
  }
}
