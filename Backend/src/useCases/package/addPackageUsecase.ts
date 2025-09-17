import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";
import { Package } from "../../domain/entities/packageEntity";
import { mapToPackageDto } from "../../mappers/packages/mapTopackages";

export class CreatePackagesUseCase {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute(data: Package): Promise<Package> {
    const createdDoc = await this._packageRepo.createPackage(data)
    console.log(createdDoc,"create")
    return mapToPackageDto(createdDoc);
  }
}
