import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";
import { Package } from "../../domain/entities/packageEntity";
import { mapToPackageDto } from "../../mappers/packages/mapTopackages";

export class CreatePackagesUseCase {
  constructor(private packageRepo: IPackageRepository) {}

  async execute(data: Package): Promise<Package> {
    const created = await this.packageRepo.createPackage(data);
    return mapToPackageDto(created);
  }
}
