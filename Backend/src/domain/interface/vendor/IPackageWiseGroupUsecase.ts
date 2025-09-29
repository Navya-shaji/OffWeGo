import { PackageDTO } from "../../dto/package/PackageDto";
import { PackageWiseGroup } from "../../entities/PackagewiseGroup";


export interface ICreateGroupUseCase {
  execute(groupData:PackageDTO): Promise<PackageWiseGroup>;
}
