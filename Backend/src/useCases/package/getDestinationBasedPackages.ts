import { IGetDestinationBasedPackage } from "../../domain/interface/Vendor/IGetDestinationBasedPackage"; 
import { Package } from "../../domain/entities/packageEntity"; 
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";

export class GetDestinationBasedPackageUseCase implements IGetDestinationBasedPackage {
    constructor(
        private packageRepo:IPackageRepository
    ){}
 async execute(destinationId: string, skip: number = 0, limit: number = 3): Promise<{
    packages: Package[];
    totalPackages: number;
  }> {
    try {
      const response = await this.packageRepo.getPackagesByDestination(destinationId, skip, limit);
      return {
        packages: response.packages,
        totalPackages: response.totalPackages
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Unknown error while fetching packages by destination");
    }
  }
}
