import { CreateGroupDTO } from "../../dto/package/PackageDto";
import { PackageWiseGroup } from "../../entities/PackagewiseGroup";


export interface ICreateGroupUseCase {
  execute(groupData:CreateGroupDTO): Promise<PackageWiseGroup>;
}
