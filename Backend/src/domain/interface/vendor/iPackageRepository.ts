import { FilterQuery } from "mongoose";
import { IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../entities/packageEntity";

export interface IPackageRepository {
  findById(packageId: any): unknown;
  createPackage(data: Package): Promise<IPackageModel>;

  getAllPackages(
    skip: number,
    limit: number
  ): Promise<{ packages: IPackageModel[]; totalPackages: number }>;

  getPackagesByDestination(
    destinationId: string,
    skip: number,
    limit: number
  ): Promise<{ packages: IPackageModel[]; totalPackages: number }>;

  delete(id: string): Promise<IPackageModel | null>;

  searchPackage(query: string): Promise<Package[]>;
  countPackagesByVendor(vendorId: string): Promise<number>;
  countPackages(): Promise<number>;

  getAllPackagesByVendor(
    vendorId: string,
    skip: number,
    limit: number
  ): Promise<{ packages: IPackageModel[]; totalPackages: number }>;

  findOne(filter: FilterQuery<IPackageModel>): Promise<IPackageModel | null>;
  getById(id: string): Promise<IPackageModel | null>;
}
