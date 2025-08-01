import { PackageWiseGroup } from "../../domain/entities/packagewiseGroup";
import { IPackageWiseGrouping } from "../../domain/interface/vendor/IPackagewiseGroupingRepository";

export class GetAllPackageWiseGroup{
    constructor(private packagewiseGroupRepo:IPackageWiseGrouping){}

    async execute(packageId: string):Promise<PackageWiseGroup[]|null>{
        const groups=await this.packagewiseGroupRepo.getGroupsByPackage(packageId)
        return groups
    }
}