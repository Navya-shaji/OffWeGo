import { PackageDTO } from "../../dto/Package/PackageDto";
import { PackageWiseGroup } from "../../entities/PackagewiseGroup";


export interface ICreateGroupUseCase {
  execute(groupData: PackageDTO): Promise<PackageWiseGroup>;
}
