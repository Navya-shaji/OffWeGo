import { Destination } from "../../entities/DestinationEntity";

export interface IsearchDestination {
  execute(query: string): Promise<Destination[]>;
}
