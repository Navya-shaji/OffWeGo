import { PackageDTO } from "../../dto/Package/PackageDto";
import { PackageWiseGroup } from "../../entities/PackagewiseGroup";

export interface IPackageWiseGrouping {
    createGroup(data: PackageDTO): Promise<PackageWiseGroup>
    getGroupsByPackage(packageId: string): Promise<PackageWiseGroup[]>
}