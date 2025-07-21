import { Package } from "../../entities/packageEntity";

export interface IGetPackageUsecase{
    execute():Promise<Package[]|null>
}