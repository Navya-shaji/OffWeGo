import { IPackageRepository } from "../../../domain/interface/vendor/iPackageRepository";
import { packageModel, IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/packageEntity";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class PackageRepository 
  extends BaseRepository<IPackageModel> 
  implements IPackageRepository 
{
  constructor() {
    super(packageModel); 
  }

  async createPackage(data: Package): Promise<IPackageModel> {
    const created = await packageModel.create(data);
    await created.populate(["hotels", "activities"]);
    return created;
  }

  async getAllPackages(
    skip: number, 
    limit: number
  ): Promise<{ packages: IPackageModel[]; totalPackages: number }> {
    const [packages, totalPackages] = await Promise.all([
      packageModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate("hotels")
        .populate("activities")
        .exec(),
      packageModel.countDocuments(),
    ]);

    return { packages, totalPackages };
  }

  async getPackagesByDestination(destination: string): Promise<IPackageModel[]> {
    return packageModel
      .find({ destinationId: destination })
      .populate("hotels")
      .populate("activities")
      .exec();
  }

  async delete(id: string): Promise<IPackageModel | null> {
    return await this.model.findByIdAndDelete(id);
  }

async searchPackage(query: string): Promise<Package[]> {
    return await this.model.find({
      packageName: { $regex: query, $options: "i" }
    }) as Package[]
  }

  async countPackages(): Promise<number> {
    return packageModel.countDocuments();
  }
}
