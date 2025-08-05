import { CreateGroupDTO } from "../../dto/package/PackageDto";
import { PackageWiseGroup } from "../../entities/packagewiseGroup";


export interface ICreateGroupUseCase {
  execute(groupData:CreateGroupDTO): Promise<PackageWiseGroup>;
}
