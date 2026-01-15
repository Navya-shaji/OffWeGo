import { Destination } from "../../entities/DestinationEntity";

export interface IGetPackageUsecase {
  execute(destination?: string): Promise<Destination>;
}
