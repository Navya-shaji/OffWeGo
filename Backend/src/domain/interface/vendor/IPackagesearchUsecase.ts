import { Package } from "../../entities/packageEntity";

export interface ISearchPackageUsecase{
    execute(query:string):Promise<Package[]>
}