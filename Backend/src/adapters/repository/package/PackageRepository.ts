import { IPackageRepository } from "../../../domain/interface/Vendor/iPackageRepository";
import {
  packageModel,
  IPackageModel,
} from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/PackageEntity";
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

  async getPackagesByDestination(
    destinationId: string,
    skip: number,
    limit: number
  ): Promise<{ packages: IPackageModel[]; totalPackages: number }> {
    const [packages, totalPackages] = await Promise.all([
      packageModel
        .find({ destinationId })
        .skip(skip)
        .limit(limit)
        .populate("hotels")
        .populate("activities")
        .exec(),
      packageModel.countDocuments({ destinationId }),
    ]);

    return { packages, totalPackages };
  }

  async delete(id: string): Promise<IPackageModel | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async searchPackage(query: string): Promise<Package[]> {
    const regex = new RegExp(query, "i");
    return await this.model
      .find({ packageName: { $regex: regex } })
      .select(
        "packageName itinerary inclusions  amenities price duration hotels activities"
      )
      .populate("hotels", "name")
      .populate("activities", "title")
      .limit(10)
      .exec();
  }

  async countPackages(): Promise<number> {
    return packageModel.countDocuments();
  }
  async getAllPackagesByVendor(
    vendorId: string,
    skip: number,
    limit: number
  ): Promise<{ packages: IPackageModel[]; totalPackages: number }> {
    const [packages, totalPackages] = await Promise.all([
      packageModel
        .find({ vendorId })
        .skip(skip)
        .limit(limit)
        .populate("hotels")
        .populate("activities")
        .exec(), // <-- returns IPackageModel[]
      packageModel.countDocuments({ vendorId }),
    ]);

    return { packages, totalPackages };
  }
}
