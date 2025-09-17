import { Package } from "../../entities/PackageEntity"
export interface IEditPackageUsecase{
    execute(id:string,updatedData:Package):Promise<Package|null>
}