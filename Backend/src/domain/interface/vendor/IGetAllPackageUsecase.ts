
import { IPackageModel } from "../../../framework/database/Models/packageModel";

export interface IGetAllPackageUsecase {
  execute(page: number, limit: number): Promise<{ packages: IPackageModel[], totalPackages: number }>
}
