import { FlightDto } from "../../domain/dto/Flight/FlightDto";
import { ICreateFlightUsecase } from "../../domain/interface/Flight/ICreateFlightUsecase";
import { IFlightRepository } from "../../domain/interface/Flight/IFlightRepository";
import { mapToFlightDto } from "../../mappers/Flight/mapToFlight";

export class CreateflightUsecase implements ICreateFlightUsecase {
  constructor(private _flightrepo: IFlightRepository) {}

  async execute(data: FlightDto): Promise<FlightDto> {
    const existingFlight = await this._flightrepo.findByName(data.airLine);
    if (existingFlight) throw new Error("Flight name already exists");

    const created = await this._flightrepo.createFlight(data);
    return mapToFlightDto(created);
  }
}
