import { IGetPackageUsecase } from "../../domain/interface/Vendor/IGetPackageUsecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository"; 
import { IPackageModel } from "../../framework/database/Models/packageModel"; 

export class GetPackageUsecase implements IGetPackageUsecase {
  constructor(private _packageRepository: IPackageRepository) {}

  async execute(
    destination?: string,
    page: number = 1,
    limit: number = 3
  ): Promise<{ packages: IPackageModel[]; totalPackages: number; totalPages: number; currentPage: number }> {
    if (!destination) {
      return { packages: [], totalPackages: 0, totalPages: 0, currentPage: page };
    }

    const skip = (page - 1) * limit;

    const { packages, totalPackages } = await this._packageRepository.getPackagesByDestination(destination, skip, limit);

    return {
      packages,
      totalPackages,
      totalPages: Math.ceil(totalPackages / limit),
      currentPage: page,
    };
  }
}
