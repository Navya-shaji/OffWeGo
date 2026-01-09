import { IPackageRepository } from "../../../domain/interface/Vendor/iPackageRepository";
import {
  packageModel,
  IPackageModel,
} from "../../../framework/database/Models/packageModel";
import { Package } from "../../../domain/entities/PackageEntity";
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
    const created = await packageModel.create(data);
    await created.populate(["hotels", "activities", "flight"]);
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
        .populate("hotels activities flight")
        .exec(),
      packageModel.countDocuments().exec(),
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
        .populate("hotels activities")
        .exec(),
      packageModel.countDocuments({ destinationId }).exec(),
    ]);

    return { packages, totalPackages };
  }

  async delete(id: string): Promise<IPackageModel | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async searchPackage(query: string): Promise<IPackageModel[]> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];

    const regex = new RegExp(trimmedQuery, "i");

    return this.model
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
    return packageModel.countDocuments().exec();
  }

  async countPackagesByVendor(vendorId: string): Promise<number> {
    return packageModel.countDocuments({ vendorId }).exec();
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
        .populate("hotels activities")
        .exec(),
      packageModel.countDocuments({ vendorId }).exec(),
    ]);

    return { packages, totalPackages };
  }

  async findOne(
    filter: FilterQuery<IPackageModel>
  ): Promise<IPackageModel | null> {
    return packageModel.findOne(filter).exec();
  }

  async getById(id: string): Promise<IPackageModel | null> {
    return packageModel.findById(id).exec();
  }
}
