import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";
import { IPackageModel } from "../../framework/database/Models/packageModel";
import { IGetAllPackageUsecase } from "../../domain/interface/vendor/IGetAllPackageUsecase";

export class GetAllPackages implements IGetAllPackageUsecase {
  constructor(private packageRepo: IPackageRepository) {}

  async execute(page: number, limit: number): Promise<{ packages: IPackageModel[], totalPackages: number }> {
    const skip = (page - 1) * limit;

    const { packages, totalPackages } = await this.packageRepo.getAllPackages(skip, limit);
    

    return { packages, totalPackages };
  }
}
