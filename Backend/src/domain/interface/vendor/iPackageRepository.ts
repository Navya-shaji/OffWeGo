import { IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../entities/packageEntity";

export interface IPackageRepository{
    createPackage(data:Package):Promise<IPackageModel>
    getAllPackages():Promise<IPackageModel[]>
    getPackagesByDestination(destination: string): Promise<IPackageModel[]>;
    delete(id: string): Promise<void>;
    searchPackage(query:string):Promise<Package[]>
}