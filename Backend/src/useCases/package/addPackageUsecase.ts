import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { Package } from "../../domain/entities/PackageEntity";
import { mapToPackageDto } from "../../mappers/Packages/mapTopackages";

export class CreatePackagesUseCase {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute(data: Package): Promise<Package> {
    const createdDoc = await this._packageRepo.createPackage(data)
    console.log(createdDoc,"create")
    return mapToPackageDto(createdDoc);
  }
}
