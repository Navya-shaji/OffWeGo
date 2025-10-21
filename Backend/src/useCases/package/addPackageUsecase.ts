import { PackageDTO } from "../../domain/dto/package/PackageDto";
import { Package } from "../../domain/entities/PackageEntity";
import { ICreatePackage } from "../../domain/interface/Vendor/IAddPackageUsecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { mapToPackageDTO } from "../../mappers/Packages/mapTopackages";

export class CreatePackagesUseCase implements ICreatePackage {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute(data: Package, vendorId: string): Promise<PackageDTO> {
    const packageData: Package = { ...data, vendorId };
    packageData.hotels = (packageData.hotels || []).filter(Boolean);
    packageData.activities = (packageData.activities || []).filter(Boolean);

    const skip = 0;
    const limit = 3;

 
    const existingData = await this._packageRepo.getAllPackagesByVendor(
      vendorId,
      skip,
      limit
    );

    if (existingData.totalPackages >= 3) {
      throw new Error("Only 3 packages can be submitted per vendor");
    }

    const createdDoc = await this._packageRepo.createPackage(packageData);
    return mapToPackageDTO(createdDoc);
  }
}
