import { PackageDTO } from "../../dto/package/PackageDto";
import { Package } from "../../entities/PackageEntity";

export interface ICreatePackage{
    execute(data:Package,vendorId: string):Promise<PackageDTO>
}