import { log } from "console";
import { IGetPackagesUsecase } from "../../domain/interface/Vendor/IGetAllPackageUsecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { IPackageModel } from "../../framework/database/Models/packageModel";


export class GetPackages implements IGetPackagesUsecase {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute({
    page,
    limit,
    role,
    vendorId,
    destinationId,
  }: {
    page: number;
    limit: number;
    role: "vendor" | "user";
    vendorId?: string;
    destinationId?: string;
  }): Promise<{
    packages: IPackageModel[];
    totalPackages: number;
    totalPages: number;
    currentPage: number;
  }> {
   
    const skip = (page - 1) * limit;
    let packages: IPackageModel[] = [];
    let totalPackages = 0;


    if (role === "vendor" && vendorId) {
      
      const result = await this._packageRepo.getAllPackagesByVendor(
        vendorId,
        skip,
        limit
      );
      packages = result.packages;
      totalPackages = result.totalPackages;
    } else if (role === "user" && destinationId) {
      console.log("user")
      const result = await this._packageRepo.getPackagesByDestination(
        destinationId,
        skip,
        limit
      );
      packages = result.packages;
      totalPackages = result.totalPackages;
    }

    const totalPages = Math.ceil(totalPackages / limit);

    return {
      packages,
      totalPackages,
      totalPages,
      currentPage: page,
    };
  }
}
