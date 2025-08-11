import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";
import { IPackageModel } from "../../framework/database/Models/packageModel";
import { IGetPackageUsecase } from "../../domain/interface/vendor/IGetPackageUsecase";

export class GetAllPackages implements IGetPackageUsecase {
  constructor(private packageRepo: IPackageRepository) {}

  async execute(): Promise<IPackageModel[]> {
    const packages = await this.packageRepo.getAllPackages();
    console.log("packages usecase", packages);
    return packages
  }
}
