import { Package } from "../../domain/entities/PackageEntity";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";
import { ISearchPackageUsecase } from "../../domain/interface/Vendor/IPackagesearchUsecase";

export class SearchPackage implements ISearchPackageUsecase{
    constructor(private _packageRepo:IPackageRepository){}

    async execute(query: string): Promise<Package[]> {
        const result=await this._packageRepo.searchPackage(query)
        return result
    }
}