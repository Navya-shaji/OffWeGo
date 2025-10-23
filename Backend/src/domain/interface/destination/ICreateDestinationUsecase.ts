import { CreateDestinationDTO } from "../../dto/Admin/DestinationDTO";
import { Destination } from "../../entities/DestinationEntity";

export interface ICreateDestinationUsecase {
  execute(data: CreateDestinationDTO): Promise<Destination>;
}
