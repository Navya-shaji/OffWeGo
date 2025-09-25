import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { Package } from "../../domain/entities/PackageEntity";
import { mapToPackageDTO } from "../../mappers/Packages/mapTopackages";
import { ICreatePackage } from "../../domain/interface/Vendor/IAddPackageUsecase";
import { PackageDTO } from "../../domain/dto/package/PackageDto";

export class CreatePackagesUseCase implements ICreatePackage {
  constructor(private _packageRepo: IPackageRepository) {}

  async execute(data: Package, vendorId: string): Promise<PackageDTO> {
    const packageData: Package = { ...data, vendorId };
    console.log(packageData,"dhgdfgg")
    const createdDoc = await this._packageRepo.createPackage(packageData);
    console.log(createdDoc,"ccccccccccccccccccc")
    return mapToPackageDTO(createdDoc);
  }
}
