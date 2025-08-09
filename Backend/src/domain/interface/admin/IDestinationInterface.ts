import { IDestinationModel } from "../../../framework/database/Models/deestinationModel";
import { CreateDestinationDTO } from "../../dto/admin/DestinationDTO";
import { Destination } from "../../entities/DestinationEntity";


export interface IDestinationRepository {
  createDestination(data: CreateDestinationDTO): Promise<IDestinationModel>;
  getAllDestinations(skip: number, limit: number): Promise<IDestinationModel[]>;
  edit(destination: IDestinationModel): Promise<void>;
  countDestinations(): Promise<number>;
  delete(id: string): Promise<void>;
  getDestination(id:string):Promise<IDestinationModel |null>
  searchDestination(query:string):Promise<Destination[]>
}
