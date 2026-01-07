import { PackageDTO } from "../../dto/package/PackageDto";
import { PackageWiseGroup } from "../../entities/packagewiseGroup";

export interface IPackageWiseGrouping{
    createGroup(data:PackageDTO):Promise<PackageWiseGroup>
    getGroupsByPackage(packageId: string): Promise<PackageWiseGroup[]>
}