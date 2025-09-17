import { IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../entities/PackageEntity";

export interface IPackageRepository {
    createPackage(data: Package): Promise<IPackageModel>;
    getAllPackages(skip: number, limit: number): Promise<{ packages: IPackageModel[], totalPackages: number }>;
    getPackagesByDestination(destination: string): Promise<IPackageModel[]>;
    delete(id: string): Promise<IPackageModel|null>;
    searchPackage(query: string): Promise<Package[]>;
    countPackages(): Promise<number>;
}
