import { CreateDestinationDTO } from "../../dto/admin/DestinationDTO";
import { Destination } from "../../entities/DestinationEntity";

export interface IDestinationRepository {
  createDestination(data: CreateDestinationDTO): Promise<Destination>;
  getAllDestinations(): Promise<Destination[]>;
  edit(destination: Destination): Promise<void>;
  delete(id: string): Promise<void>;
}
