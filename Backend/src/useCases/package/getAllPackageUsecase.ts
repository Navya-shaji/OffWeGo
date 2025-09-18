import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { IPackageModel } from "../../framework/database/Models/packageModel";
import { IGetAllPackageUsecase } from "../../domain/interface/Vendor/IGetAllPackageUsecase";

export class GetAllPackages implements IGetAllPackageUsecase {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute(page: number, limit: number): Promise<{ packages: IPackageModel[], totalPackages: number }> {
    const skip = (page - 1) * limit;

    const { packages, totalPackages } = await this._packageRepo.getAllPackages(skip, limit);
    console.log(packages,totalPackages)
    console.log("All packages:", JSON.stringify(packages, null, 2));


    return { packages, totalPackages };
  }
}
