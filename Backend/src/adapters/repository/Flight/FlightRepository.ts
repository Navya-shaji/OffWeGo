import { Flight } from "../../../domain/entities/flightEntity";
import {
  IFlightModel,
  FlightModel,
} from "../../../framework/database/Models/flightModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";
import { IFlightRepository } from "../../../domain/interface/Flight/IFlightRepository";
import { FlightDto } from "../../../domain/dto/Flight/FlightDto";

export class FlightRepository
  extends BaseRepository<IFlightModel>
  implements IFlightRepository
{
  constructor() {
    super(FlightModel);
  }
  async createFlight(flightData: Partial<FlightDto>): Promise<IFlightModel> {
    const createdFlight = await FlightModel.create(flightData);
    return createdFlight;
  }
  async getAllFlights(): Promise<IFlightModel[]> {
    return this.model.find();
  }
  async getFlightById(id: string): Promise<Flight | null> {
    return this.model.findById(id);
  }
  async updateFlight(
    id: string,
    updateData: Partial<IFlightModel>
  ): Promise<IFlightModel | null> {
    return this.update(id, updateData);
  }
  async deleteFlight(id: string): Promise<Flight | null> {
    return super.delete(id);
  }
  async findByName(name: string): Promise<IFlightModel | null> {
    return this.model.findOne({ name });
  }
}
