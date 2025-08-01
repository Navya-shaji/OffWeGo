import { CreateGroupDTO } from "../../domain/dto/package/PackageDto";
import { PackageWiseGroup } from "../../domain/entities/packagewiseGroup";
import { IPackageWiseGrouping } from "../../domain/interface/vendor/IPackagewiseGroupingRepository";
import { ICreateGroupUseCase } from "../../domain/interface/vendor/IPackageWiseGroupUsecase";

export class CreatePackageWiseGroup implements ICreateGroupUseCase{
    constructor(private groupRepository:IPackageWiseGrouping){}

    async execute(groupData: CreateGroupDTO): Promise<PackageWiseGroup> {
        const group=await this.groupRepository.createGroup(groupData)
        return group
    }
}