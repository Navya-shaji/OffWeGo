import { Package } from "../../domain/entities/packageEntity";
import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";
import { ISearchPackageUsecase } from "../../domain/interface/vendor/IPackagesearchUsecase";

export class SearchPackage implements ISearchPackageUsecase{
    constructor(private packageRepo:IPackageRepository){}

    async execute(query: string): Promise<Package[]> {
        const result=await this.packageRepo.searchPackage(query)
        return result
    }
}