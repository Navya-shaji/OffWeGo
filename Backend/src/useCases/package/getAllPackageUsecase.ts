import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";
import { Package } from "../../domain/entities/packageEntity";
import { mapToPackageDto } from "../../mappers/packages/mapTopackages";

export class GetAllPackages {
    constructor(private packageRepo: IPackageRepository) {}

    async execute(): Promise<Package[]> {
        const packages = await this.packageRepo.getAllPackages();
        return packages.map(mapToPackageDto);
    }
}
