import { Package } from "../../entities/packageEntity"
export interface IEditPackageUsecase{
    execute(id:string,updatedData:Package):Promise<Package|null>
}