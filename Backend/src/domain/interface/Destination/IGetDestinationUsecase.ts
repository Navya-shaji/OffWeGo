import { Destination } from "../../entities/DestinationEntity";

export interface IgetDestinationUSecase {
  execute(id: string): Promise<Destination | null>;
}
