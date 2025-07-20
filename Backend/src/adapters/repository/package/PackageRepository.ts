import { IPackageRepository } from "../../../domain/interface/vendor/iPackageRepository";
import { packageModel,IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/packageEntity";

export class PackageRepository implements IPackageRepository{
    async createPackage(data: Package): Promise<IPackageModel> {
        return await packageModel.create(data)
    }
}