import { PackageWiseGroup } from "../../entities/packagewiseGroup";

export interface IGetPackageWiseGroupUsecase {
  execute(packageId: string): Promise<PackageWiseGroup[] | null>;
}
