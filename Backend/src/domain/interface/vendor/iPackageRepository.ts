import { IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../entities/packageEntity";

export interface IPackageRepository{
    createPackage(data:Package):Promise<IPackageModel>
    getAllPackages():Promise<IPackageModel[]>
    getPackagesByDestination(destination: string): Promise<IPackageModel[]>;
}