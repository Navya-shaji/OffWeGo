import { CreateGroupDTO } from "../../../domain/dto/package/PackageDto";
import { PackageWiseGroup } from "../../../domain/entities/PackagewiseGroup";
import { IPackageWiseGrouping } from "../../../domain/interface/Vendor/IPackagewiseGroupingRepository";
import { PackageWiseGroupingModel } from "../../../framework/database/Models/PackageWiseGroupingModel";

export class PackageWiseGrouping implements IPackageWiseGrouping{
    async createGroup(data: CreateGroupDTO): Promise<PackageWiseGroup> {
        const Group=PackageWiseGroupingModel.create({
            ...data,currentBookings:0,status:"open"
        })
        return await Group
    }
    async getGroupsByPackage(packageId: string): Promise<PackageWiseGroup[]> {
        return PackageWiseGroupingModel.find({packageId})
    }
}