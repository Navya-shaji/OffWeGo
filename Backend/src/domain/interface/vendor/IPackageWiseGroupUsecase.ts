import { PackageDTO } from "../../dto/package/PackageDto";
import { PackageWiseGroup } from "../../entities/packagewiseGroup";


export interface ICreateGroupUseCase {
  execute(groupData:PackageDTO): Promise<PackageWiseGroup>;
}
