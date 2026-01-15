import { Destination } from "../../entities/DestinationEntity";

export interface IEditDestinationUseCase {
  execute(id: string, updatedData: Destination): Promise<Destination | null>;
}
