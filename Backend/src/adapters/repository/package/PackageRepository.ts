import { IPackageRepository } from "../../../domain/interface/vendor/iPackageRepository";
import { packageModel, IPackageModel } from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/packageEntity";

export class PackageRepository implements IPackageRepository {
  async createPackage(data: Package): Promise<IPackageModel> {
    const created = await packageModel.create(data);
    await created.populate(["hotels", "activities"]);
    return created;
  }

  async getAllPackages(skip: number, limit: number): Promise<{ packages: IPackageModel[], totalPackages: number }> {
    const [packages, totalPackages] = await Promise.all([
      packageModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate("hotels")
        .populate("activities")
        .exec(),
      packageModel.countDocuments()
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

  async delete(id: string): Promise<void> {
    await packageModel.findByIdAndDelete(id);
  }

  async searchPackage(query: string): Promise<Package[]> {
    const regex = new RegExp(query, "i");
    return packageModel
      .find({ packageName: { $regex: regex } })
      .select("packageName")
      .limit(10)
      .lean()
      .exec();
  }

  async countPackages(): Promise<number> {
    return packageModel.countDocuments();
  }
}
