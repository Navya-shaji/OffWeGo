import { PackageWiseGroup } from "../../domain/entities/PackagewiseGroup";
import { IPackageWiseGrouping } from "../../domain/interface/Vendor/IPackagewiseGroupingRepository";

export class GetAllPackageWiseGroup{
    constructor(private _packagewiseGroupRepo:IPackageWiseGrouping){}

    async execute(packageId: string):Promise<PackageWiseGroup[]|null>{
        const groups=await this._packagewiseGroupRepo.getGroupsByPackage(packageId)
        return groups
    }
}