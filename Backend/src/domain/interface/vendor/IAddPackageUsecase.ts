import { Package } from "../../entities/PackageEntity";

export interface ICreatePackage{
    execute(data:Package):Promise<Package>
}