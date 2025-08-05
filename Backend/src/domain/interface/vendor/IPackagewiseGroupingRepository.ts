import { CreateGroupDTO } from "../../dto/package/PackageDto";
import { PackageWiseGroup } from "../../entities/packagewiseGroup";

export interface IPackageWiseGrouping{
    createGroup(data:CreateGroupDTO):Promise<PackageWiseGroup>
    getGroupsByPackage(packageId: string): Promise<PackageWiseGroup[]>
}