import { Package } from "../../entities/packageEntity";

export interface ICreatePackage{
    execute(data:Package):Promise<Package>
}