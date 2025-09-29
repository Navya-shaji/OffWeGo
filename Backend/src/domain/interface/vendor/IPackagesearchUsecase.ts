import { Package } from "../../entities/PackageEntity";

export interface ISearchPackageUsecase{
    execute(query:string):Promise<Package[]>
}