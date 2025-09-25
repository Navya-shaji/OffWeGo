import { IPackageModel } from "../../../framework/database/Models/packageModel";

export interface IGetPackagesUsecase {
  execute(params: {
    page: number;
    limit: number;
    role: "vendor" | "user";
    vendorId?: string;
    destinationId?: string;
  }): Promise<{
    packages: IPackageModel[];
    totalPackages: number;
    totalPages: number;
    currentPage: number;
  }>;
}
