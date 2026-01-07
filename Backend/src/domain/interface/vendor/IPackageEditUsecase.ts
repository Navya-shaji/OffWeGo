import { PackageDTO } from "../../dto/package/PackageDto"
import { Package } from "../../entities/packageEntity"
export interface IEditPackageUsecase{
    execute(id:string,updatedData:Package):Promise<PackageDTO|null>
}