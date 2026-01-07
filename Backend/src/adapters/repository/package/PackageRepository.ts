import { IPackageRepository } from "../../../domain/interface/Vendor/iPackageRepository";
import {
  packageModel,
  IPackageModel,
} from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/packageEntity";
import { BaseRepository } from "../BaseRepo/BaseRepo";
import { FilterQuery } from "mongoose";
export class PackageRepository
  extends BaseRepository<IPackageModel>
  implements IPackageRepository
{
  constructor() {
    super(packageModel);
  }

  async createPackage(data: Package): Promise<IPackageModel> {
    const created = await (packageModel as any).create(data);
    await created.populate(["hotels", "activities", "flight"]);
    return created;
  }

  async getAllPackages(skip: number, limit: number) {
    const [packages, totalPackages] = await Promise.all([
      (packageModel as any)
        .find()
        .skip(skip)
        .limit(limit)
        .populate("hotels activities flight")
        .exec(),
      (packageModel as any).countDocuments(),
    ]);

    return { packages, totalPackages };
  }

  async getPackagesByDestination(
    destinationId: string,
    skip: number,
    limit: number
  ) {
    const [packages, totalPackages] = await Promise.all([
      (packageModel as any)
        .find({ destinationId })
        .skip(skip)
        .limit(limit)
        .populate("hotels activities")
        .exec(),
      (packageModel as any).countDocuments({ destinationId }),
    ]);

    return { packages, totalPackages };
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async searchPackage(query: string) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];

    const regex = new RegExp(trimmedQuery, "i");

    return await this.model
      .find({ packageName: { $regex: regex } })
      .select(
        "destinationId vendorId packageName description images itinerary inclusions amenities price duration startDate endDate hotels activities checkInTime checkOutTime flightOption flight"
      )
      .populate("hotels")
      .populate("activities")
      .populate("flight")
      .limit(10)
      .exec();
  }

  async countPackages(): Promise<number> {
    return (packageModel as any).countDocuments();
  }

  async countPackagesByVendor(vendorId: string): Promise<number> {
    return (packageModel as any).countDocuments({ vendorId });
  }

  async getAllPackagesByVendor(vendorId: string, skip: number, limit: number) {
    const [packages, totalPackages] = await Promise.all([
      (packageModel as any)
        .find({ vendorId })
        .skip(skip)
        .limit(limit)
        .populate("hotels activities")
        .exec(),
      (packageModel as any).countDocuments({ vendorId }),
    ]);

    return { packages, totalPackages };
  }
  async findOne(
    filter: FilterQuery<IPackageModel>
  ): Promise<IPackageModel | null> {
    const pkg = await (packageModel as any).findOne(filter).lean();
    return pkg ? (pkg as unknown as IPackageModel) : null;
  }
  async getById(id: string): Promise<IPackageModel | null> {
    return (packageModel as any).findById(id);
  }
}
