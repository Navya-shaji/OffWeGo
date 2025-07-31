import { IPackageModel } from "../../../framework/database/Models/packageModel";

export interface IGetPackageUsecase {
  execute(destination?: string): Promise<IPackageModel[]>;
}
