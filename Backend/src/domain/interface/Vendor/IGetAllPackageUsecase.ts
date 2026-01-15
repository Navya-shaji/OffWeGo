import { IPackageModel } from "../../../framework/database/Models/packageModel";
import { Role } from "../../constants/Roles";

export interface IGetPackagesUsecase {
  execute(params: {
    page: number;
    limit: number;
    role: Role
    vendorId?: string;
    destinationId?: string;
  }): Promise<{
    packages: IPackageModel[];
    totalPackages: number;
    totalPages: number;
    currentPage: number;
  }>;
}
