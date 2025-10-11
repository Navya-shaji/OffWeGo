import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { Package } from "../../domain/entities/PackageEntity";
import { mapToPackageDTO } from "../../mappers/Packages/mapTopackages";
import { ICreatePackage } from "../../domain/interface/Vendor/IAddPackageUsecase";
import { PackageDTO } from "../../domain/dto/package/PackageDto";

export class CreatePackagesUseCase implements ICreatePackage {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute(data: Package, vendorId: string): Promise<PackageDTO> {
    const packageData: Package = { ...data, vendorId };

    packageData.hotels = (packageData.hotels || []).filter(Boolean);
    packageData.activities = (packageData.activities || []).filter(Boolean);

    console.log(packageData, "pp");

    const createdDoc = await this._packageRepo.createPackage(packageData);
    console.log(createdDoc,"created")

    return mapToPackageDTO(createdDoc);
  }
}

