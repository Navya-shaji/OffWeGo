import { IPackageRepository } from "../../../domain/interface/vendor/iPackageRepository";
import { packageModel, IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/packageEntity";

export class PackageRepository implements IPackageRepository {
  async createPackage(data: Package): Promise<IPackageModel> {
  const created = await packageModel.create(data);
  
  await created.populate(['hotels', 'activities']);
  return created;
}


async getAllPackages(): Promise<IPackageModel[]> {
  return packageModel
    .find()
    .populate("hotels")
    .populate("activities")
    .exec();
}


  async getPackagesByDestination(destination: string): Promise<IPackageModel[]> {
    return packageModel
      .find({ destinationId: destination }) 
      .populate("hotels")
      .populate("activities")
      .exec();
  }

  async delete(id: string): Promise<void> {
    await packageModel.findByIdAndDelete(id);
  }
}
