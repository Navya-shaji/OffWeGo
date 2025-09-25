import { IPackageModel } from "../../../framework/database/Models/packageModel";

export interface IGetPackageUsecase {
  execute(
    destination?: string,
    page?: number,
    limit?: number
  ): Promise<{
    packages: IPackageModel[];
    totalPackages: number;
    totalPages: number;
    currentPage: number;
  }>;
}
