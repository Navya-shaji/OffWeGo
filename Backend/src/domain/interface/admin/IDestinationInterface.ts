import { IDestinationModel } from "../../../framework/database/Models/deestinationModel";
import { CreateDestinationDTO } from "../../dto/admin/DestinationDTO";


export interface IDestinationRepository {
  createDestination(data: CreateDestinationDTO): Promise<IDestinationModel>;
  getAllDestinations(): Promise<IDestinationModel[]>;
  edit(destination: IDestinationModel): Promise<void>;
  delete(id: string): Promise<void>;
  getDestination(id:string):Promise<IDestinationModel |null>
}
