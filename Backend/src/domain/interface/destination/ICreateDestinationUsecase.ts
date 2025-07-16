import { CreateDestinationDTO } from "../../dto/admin/DestinationDTO";
import { Destination } from "../../entities/DestinationEntity";

export interface ICreateDestinationUsecase{
    execute(data: CreateDestinationDTO): Promise<Destination>
}