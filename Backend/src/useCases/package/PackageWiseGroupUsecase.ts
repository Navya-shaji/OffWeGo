import { PackageDTO} from "../../domain/dto/package/PackageDto";
import { PackageWiseGroup } from "../../domain/entities/PackagewiseGroup";
import { IPackageWiseGrouping } from "../../domain/interface/Vendor/IPackagewiseGroupingRepository";
import { ICreateGroupUseCase } from "../../domain/interface/Vendor/IPackageWiseGroupUsecase";

export class CreatePackageWiseGroup implements ICreateGroupUseCase{
    constructor(private _groupRepository:IPackageWiseGrouping){}

    async execute(groupData: PackageDTO): Promise<PackageWiseGroup> {
        const group=await this._groupRepository.createGroup(groupData)
        return group
    }
}