import { PackageWiseGroup } from "../../entities/PackagewiseGroup";

export interface IGetPackageWiseGroupUsecase {
  execute(packageId: string): Promise<PackageWiseGroup[] | null>;
}
