import { CreateDestinationDTO } from "../../dto/admin/DestinationDTO";
import { Destination } from "../../entities/DestinationEntity";

export interface IDestinationRepository {
  createDestination(data: CreateDestinationDTO): Promise<Destination>;
  getAllDestinations(): Promise<Destination[]>;
}